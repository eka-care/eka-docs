// Runs the ABDM Connect quickstart's calls against the sandbox from the reader's
// browser, one step at a time, and shows each request and response.
//
// Sandbox only. Credentials, the access token, the Aadhaar number, the OTP and
// the mobile are held in component state and nowhere else: never in storage,
// never in a URL, never written to the console. The request log masks them.
//
// Paths, bodies and response fields follow api-reference/user-app/abdm-connect/
// quickstart.mdx and registration.yml. Helpers live inside the component, and
// inputs are rendered by plain functions rather than inner components, so a
// re-render never remounts a field and loses its focus.
export const AbhaQuickstart = () => {
  const BASE = "https://api.dev.eka.care";
  const REG = "/abdm/na/v1/registration";
  const DOT = "••••";
  const STEPS = [
    { n: 1, label: "Create a session" },
    { n: 2, label: "Send Aadhaar" },
    { n: 3, label: "Verify the OTP" },
    { n: 4, label: "Choose an address" },
    { n: 5, label: "Create the ABHA" },
  ];
  // Response fields that carry a live credential. Shown masked in the log.
  const SECRET_KEYS = ["access_token", "refresh_token", "token", "min_token"];

  const [step, setStep] = useState(1);
  const [reached, setReached] = useState(1);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState({ kind: "idle", text: "" });
  const [logs, setLogs] = useState({});

  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [token, setToken] = useState("");

  const [aadhaar, setAadhaar] = useState("");
  const [initTxn, setInitTxn] = useState("");
  const [hint, setHint] = useState("");

  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [verifyTxn, setVerifyTxn] = useState("");
  const [stop, setStop] = useState(null);

  const [suggestions, setSuggestions] = useState(null);
  const [address, setAddress] = useState("");
  const [freeAddress, setFreeAddress] = useState("");

  const [created, setCreated] = useState(null);

  const digits = (value) => value.replace(/\D/g, "");
  const aadhaarDigits = digits(aadhaar);
  const valid = {
    1: clientId.trim() !== "" && clientSecret.trim() !== "",
    2: aadhaarDigits.length === 12,
    3: /^\d{6}$/.test(otp.trim()) && /^\d{10}$/.test(mobile.trim()),
    4: address.trim() !== "",
  };

  const say = (kind, text) => setStatus({ kind, text });

  const maskAadhaar = (value) => "XXXX XXXX " + digits(value).slice(-4);
  const maskMobile = (value) => "XXXXXX" + value.trim().slice(-4);

  // A copy of a response with credentials masked and a photo shortened.
  const scrub = (value) => {
    if (Array.isArray(value)) return value.map(scrub);
    if (value && typeof value === "object") {
      const out = {};
      Object.keys(value).forEach((key) => {
        const v = value[key];
        if (SECRET_KEYS.includes(key) && typeof v === "string" && v) out[key] = DOT;
        else if (key === "profile_photo" && typeof v === "string" && v.length > 40)
          out[key] = "(image, " + v.length + " characters)";
        else out[key] = scrub(v);
      });
      return out;
    }
    return value;
  };

  // Send one request. `shownBody` is what the log displays in place of the
  // real body, with sensitive values masked.
  const send = async (n, method, path, body, shownBody, auth) => {
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) headers["Authorization"] = "Bearer " + token;
    const entry = {
      method,
      path,
      headers: Object.keys(headers).map((h) => h + ": " + (h === "Authorization" ? "Bearer " + DOT : headers[h])),
      body: shownBody,
    };
    let json = null;
    try {
      const response = await fetch(BASE + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const text = await response.text();
      try { json = JSON.parse(text); } catch (e) { json = null; }
      entry.status = response.status;
      entry.ok = response.ok;
      entry.response = json !== null ? JSON.stringify(scrub(json), null, 2) : text || "(empty body)";
    } catch (e) {
      entry.network = true;
    }
    setLogs((current) => ({ ...current, [n]: [...(current[n] || []), entry] }));
    return { ok: Boolean(entry.ok), status: entry.status, network: Boolean(entry.network), json };
  };

  // Plain-language reason for a failed call, from the error body.
  const failure = (n, result) => {
    if (result.network) {
      say("error", "The request did not reach the sandbox. That is a network problem or the browser blocking the call. Use the curl commands in the steps below instead.");
      return;
    }
    const j = result.json || {};
    const parts = ["Step " + n + " failed with status " + result.status + "."];
    if (j.error) parts.push(String(j.error));
    if (j.source_error && (j.source_error.code || j.source_error.message))
      parts.push([j.source_error.code, j.source_error.message].filter(Boolean).join(": "));
    if (result.status === 401 && n > 1) parts.push("The token may have expired. Run step 1 again.");
    say("error", parts.join(" "));
  };

  // Running a step again clears everything that depended on its result.
  const clearAfter = (n) => {
    setLogs((current) => {
      const kept = {};
      Object.keys(current).forEach((k) => { if (Number(k) < n) kept[k] = current[k]; });
      return kept;
    });
    if (n <= 2) { setInitTxn(""); setHint(""); }
    if (n <= 3) { setVerifyTxn(""); setStop(null); }
    if (n <= 4) { setSuggestions(null); setFreeAddress(""); }
    setCreated(null);
    setReached(n);
  };

  const advance = (n) => { setReached(n); setStep(n); };

  const runLogin = async (event) => {
    event.preventDefault();
    if (!valid[1] || busy) return;
    clearAfter(1);
    setBusy(true);
    say("busy", "Creating a session.");
    const id = clientId.trim();
    const result = await send(1, "POST", "/connect-auth/v1/account/login",
      { client_id: id, client_secret: clientSecret.trim() },
      { client_id: id, client_secret: DOT }, false);
    setBusy(false);
    const minted = result.json && result.json.access_token;
    if (result.ok && minted) {
      setToken(minted);
      say("ok", "Step 1 done. You have an access token for the next calls.");
      advance(2);
    } else if (result.ok) {
      say("error", "Step 1 returned no access_token. The response is shown below.");
    } else failure(1, result);
  };

  const runInit = async (event) => {
    event.preventDefault();
    if (!valid[2] || busy) return;
    clearAfter(2);
    setBusy(true);
    say("busy", "Sending the Aadhaar number.");
    const result = await send(2, "POST", REG + "/aadhaar/init",
      { aadhaar_number: aadhaarDigits },
      { aadhaar_number: maskAadhaar(aadhaarDigits) }, true);
    setBusy(false);
    const txn = result.json && result.json.txn_id;
    if (result.ok && txn) {
      setInitTxn(txn);
      setHint((result.json && result.json.hint) || "");
      say("ok", "Step 2 done. An OTP is on its way to the Aadhaar-linked mobile.");
      advance(3);
    } else if (result.ok) {
      say("error", "Step 2 returned no txn_id. The response is shown below.");
    } else failure(2, result);
  };

  const runVerify = async (event) => {
    event.preventDefault();
    if (!valid[3] || busy || !initTxn) return;
    clearAfter(3);
    setBusy(true);
    say("busy", "Verifying the OTP.");
    const result = await send(3, "POST", REG + "/aadhaar/verify",
      { txn_id: initTxn, otp: otp.trim(), mobile: mobile.trim() },
      { txn_id: initTxn, otp: "••••••", mobile: maskMobile(mobile) }, true);
    setBusy(false);
    if (!result.ok) return failure(3, result);
    const j = result.json || {};
    const profiles = Array.isArray(j.abha_profiles) ? j.abha_profiles : [];
    if (j.txn_id) setVerifyTxn(j.txn_id);
    if (j.skip_state === "confirm_mobile_otp") {
      setStop({ kind: "mobile" });
      say("info", "The mobile you sent is not the one linked to this Aadhaar, so ABDM wants it verified first.");
    } else if (profiles.length) {
      setStop({ kind: "existing", profiles });
      say("info", "This Aadhaar already has an ABHA. The patient logs in instead of creating another.");
    } else if (j.skip_state === "abha_create" && j.txn_id) {
      say("ok", "Step 3 done. The patient has no ABHA yet, so choose an address.");
      advance(4);
    } else {
      setStop({ kind: "other", state: j.skip_state || "(none)" });
      say("info", "Step 3 returned a result this page does not walk through.");
    }
  };

  const runSuggest = async (event) => {
    event.preventDefault();
    if (busy || !verifyTxn) return;
    setBusy(true);
    say("busy", "Fetching suggested addresses.");
    const path = REG + "/suggest?transactionId=" + encodeURIComponent(verifyTxn);
    const result = await send(4, "GET", path, undefined, undefined, true);
    setBusy(false);
    if (!result.ok) return failure(4, result);
    const list = (result.json && Array.isArray(result.json.suggestions)) ? result.json.suggestions : [];
    setSuggestions(list);
    say("ok", list.length ? "Pick a suggestion or type your own, then check it is free." : "No suggestions came back. Type an address, then check it is free.");
  };

  const runCheck = async (event) => {
    event.preventDefault();
    if (!valid[4] || busy || !verifyTxn) return;
    const chosen = address.trim();
    setFreeAddress("");
    setBusy(true);
    say("busy", "Checking the address is free.");
    const result = await send(4, "POST", REG + "/phr/check",
      { abha_address: chosen }, { abha_address: chosen }, true);
    setBusy(false);
    if (!result.ok) return failure(4, result);
    const exists = result.json && result.json.exists;
    if (exists === false) {
      setFreeAddress(chosen);
      say("ok", "Step 4 done. " + chosen + " is free.");
      advance(5);
    } else if (exists === true) {
      say("error", chosen + " is taken. Pick another address and check again.");
    } else {
      say("error", "The check returned no exists field. The response is shown below.");
    }
  };

  const runCreate = async (event) => {
    event.preventDefault();
    if (busy || !verifyTxn || !freeAddress || created) return;
    setBusy(true);
    say("busy", "Creating the ABHA.");
    const result = await send(5, "POST", REG + "/aadhaar/create-phr",
      { txn_id: verifyTxn, abha_address: freeAddress },
      { txn_id: verifyTxn, abha_address: freeAddress }, true);
    setBusy(false);
    if (!result.ok) return failure(5, result);
    const j = result.json || {};
    const profile = j.profile || {};
    setCreated({
      number: profile.abha_number || "",
      address: profile.abha_address || "",
      oid: (j.eka && j.eka.oid) || "",
    });
    say("ok", profile.abha_number ? "Step 5 done. The sandbox ABHA exists." : "Step 5 returned 200 without profile.abha_number. The response is shown below.");
  };

  const startAgain = () => {
    setStep(1); setReached(1); setBusy(false); setStatus({ kind: "idle", text: "" }); setLogs({});
    setClientId(""); setClientSecret(""); setShowSecret(false); setToken("");
    setAadhaar(""); setInitTxn(""); setHint("");
    setOtp(""); setMobile(""); setVerifyTxn(""); setStop(null);
    setSuggestions(null); setAddress(""); setFreeAddress(""); setCreated(null);
  };

  const field = (id, label, value, onChange, extra) => (
    <div className="eka-qs-field">
      <label className="eka-qs-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="eka-qs-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...(extra || {})}
      />
    </div>
  );

  const submit = (text, enabled) => (
    <button type="submit" className="eka-qs-btn" disabled={!enabled || busy}>
      {busy ? "Working..." : text}
    </button>
  );

  const renderLog = (n) => {
    const entries = logs[n];
    if (!entries || !entries.length) return null;
    return (
      <div className="eka-qs-log" aria-label="Requests sent and responses received">
        {entries.map((entry, i) => (
          <div className="eka-qs-exchange" key={i}>
            <div className="eka-qs-panel">
              <p className="eka-qs-panel-label">Request</p>
              <pre className="eka-qs-pre">{entry.method + " " + entry.path + "\n" + entry.headers.join("\n") +
                (entry.body ? "\n\n" + JSON.stringify(entry.body, null, 2) : "")}</pre>
            </div>
            <div className="eka-qs-panel">
              <p className="eka-qs-panel-label">
                Response
                {entry.status !== undefined && (
                  <span className={"eka-qs-code " + (entry.ok ? "eka-qs-code-ok" : "eka-qs-code-bad")}>{entry.status}</span>
                )}
              </p>
              {entry.network ? (
                <p className="eka-qs-note">No response. The request did not reach the sandbox, so there is nothing to show. Use the curl commands below instead.</p>
              ) : (
                <pre className="eka-qs-pre">{entry.response}</pre>
              )}
              {!entry.ok && !entry.network && (
                <p className="eka-qs-note">Check <a href="/docs/hie-cm/errors">errors</a>.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStop = () => {
    if (!stop) return null;
    if (stop.kind === "existing") return (
      <div className="eka-qs-callout">
        <p>This Aadhaar already has these ABHA addresses:</p>
        <ul>
          {stop.profiles.map((p, i) => (
            <li key={i}><code>{p.abha_address}</code>{p.name ? " (" + p.name + ")" : ""}</li>
          ))}
        </ul>
        <p>
          The patient picks one and your app calls Auto Login with it and this <code>txn_id</code>, instead of creating a duplicate.
          See <a href="/docs/hie-cm/workflows/login-abha">Log in to an existing ABHA</a>. This runner stops here.
        </p>
      </div>
    );
    if (stop.kind === "mobile") return (
      <div className="eka-qs-callout">
        <p>
          <code>skip_state</code> is <code>confirm_mobile_otp</code>. The mobile you sent differs from the one linked to this Aadhaar, so an OTP went to it.
          Verify it as in <a href="/docs/hie-cm/workflows/create-abha-aadhaar-otp#steps">the workflow's mobile verification step</a>.
          This runner stops here. Start again with the Aadhaar-linked mobile to stay on the quickstart's path.
        </p>
      </div>
    );
    return (
      <div className="eka-qs-callout">
        <p>
          <code>skip_state</code> is <code>{stop.state}</code>. This runner walks only the new-patient path. See the
          {" "}<a href="/docs/hie-cm/workflows/create-abha-aadhaar-otp">workflow page</a> for this branch.
        </p>
      </div>
    );
  };

  const renderStep = () => {
    if (step === 1) return (
      <form className="eka-qs-form" onSubmit={runLogin}>
        <h3 className="eka-qs-title">Create a session</h3>
        <p className="eka-qs-lede">Exchange your sandbox client id and secret for the access token every later call sends.</p>
        {field("eka-qs-client-id", "Client ID", clientId, setClientId)}
        <div className="eka-qs-field">
          <label className="eka-qs-label" htmlFor="eka-qs-client-secret">
            Client secret <span className="eka-qs-pill">Sensitive</span>
          </label>
          <div className="eka-qs-secret">
            <input
              id="eka-qs-client-secret"
              className="eka-qs-input"
              type={showSecret ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="eka-qs-secret-hint"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
            <button
              type="button"
              className="eka-qs-reveal"
              aria-pressed={showSecret}
              aria-label={showSecret ? "Hide client secret" : "Show client secret"}
              onClick={() => setShowSecret((s) => !s)}
            >
              {showSecret ? "Hide" : "Show"}
            </button>
          </div>
          <p className="eka-qs-hint" id="eka-qs-secret-hint">Held in this page only while the tab is open. It is never written to storage and never put in a URL.</p>
        </div>
        {submit("Create session", valid[1])}
        {renderLog(1)}
      </form>
    );
    if (step === 2) return (
      <form className="eka-qs-form" onSubmit={runInit}>
        <h3 className="eka-qs-title">Send the Aadhaar number</h3>
        <p className="eka-qs-lede">ABDM sends an OTP to the mobile linked to this Aadhaar. Use a sandbox test Aadhaar, not a real person's.</p>
        <div className="eka-qs-field">
          <label className="eka-qs-label" htmlFor="eka-qs-aadhaar">
            Aadhaar number <span className="eka-qs-pill">Sensitive</span>
          </label>
          <input
            id="eka-qs-aadhaar"
            className="eka-qs-input"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby="eka-qs-aadhaar-hint"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
          />
          <p className="eka-qs-hint" id="eka-qs-aadhaar-hint">Twelve digits. Held in this page only, and masked in the request log.</p>
        </div>
        {submit("Send OTP", valid[2])}
        {renderLog(2)}
      </form>
    );
    if (step === 3) return (
      <form className="eka-qs-form" onSubmit={runVerify}>
        <h3 className="eka-qs-title">Verify the OTP</h3>
        <p className="eka-qs-lede">
          {hint ? hint + ". " : ""}Enter the OTP and the Aadhaar-linked mobile. The ABHA will use this mobile.
        </p>
        {field("eka-qs-otp", "OTP", otp, setOtp, { inputMode: "numeric", autoComplete: "one-time-code" })}
        {field("eka-qs-mobile", "Mobile number", mobile, setMobile, { type: "tel", inputMode: "numeric" })}
        {submit("Verify OTP", valid[3] && Boolean(initTxn))}
        {renderStop()}
        {renderLog(3)}
      </form>
    );
    if (step === 4) return (
      <div className="eka-qs-form">
        <h3 className="eka-qs-title">Choose an address</h3>
        <p className="eka-qs-lede">Fetch addresses that are free to take, or type your own. Then check it is free.</p>
        <form onSubmit={runSuggest}>
          <button type="submit" className="eka-qs-btn eka-qs-btn-quiet" disabled={busy || !verifyTxn}>
            {busy ? "Working..." : "Get suggestions"}
          </button>
        </form>
        {suggestions && suggestions.length > 0 && (
          <div className="eka-qs-chips" role="group" aria-label="Suggested addresses">
            {suggestions.map((s) => (
              <button
                type="button"
                key={s}
                className={"eka-qs-chip" + (address === s ? " eka-qs-chip-on" : "")}
                aria-pressed={address === s}
                onClick={() => setAddress(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={runCheck}>
          {field("eka-qs-address", "ABHA address", address, setAddress)}
          {submit("Check it is free", valid[4] && Boolean(verifyTxn))}
        </form>
        {renderLog(4)}
      </div>
    );
    return (
      <form className="eka-qs-form" onSubmit={runCreate}>
        <h3 className="eka-qs-title">Create the ABHA</h3>
        <p className="eka-qs-lede">
          This creates a real sandbox account for <code>{freeAddress}</code>, so send it once.
        </p>
        {!created && submit("Create ABHA", Boolean(verifyTxn && freeAddress))}
        {created && (
          <div className="eka-qs-result">
            <dl>
              <div><dt>ABHA number</dt><dd>{created.number || "(not in the response)"}</dd></div>
              <div><dt>ABHA address</dt><dd>{created.address || "(not in the response)"}</dd></div>
              <div><dt>eka.oid</dt><dd>{created.oid || "(not in the response)"}</dd></div>
            </dl>
            <p>
              What you just did: logged in a client, verified an Aadhaar with an OTP and created a KYC-verified ABHA with the address you chose.
              Later calls for this patient send <code>eka.oid</code> in the <code>X-Pt-Id</code> header.
            </p>
            <p>
              Next, <a href="/docs/hie-cm/workflows/link-care-context-hip">link a care context</a> to this ABHA,
              or see <a href="#next">where to go next</a>.
            </p>
          </div>
        )}
        {renderLog(5)}
      </form>
    );
  };

  return (
    <div className="eka-qs not-prose">
      <ol className="eka-qs-stepper" aria-label="Steps to create an ABHA">
        {STEPS.map((s) => {
          const state = s.n === step ? "current" : s.n < reached ? "done" : "todo";
          return (
            <li key={s.n} className={"eka-qs-stepper-item eka-qs-" + state}>
              <button
                type="button"
                className="eka-qs-stepper-btn"
                disabled={s.n > reached || busy}
                aria-current={s.n === step ? "step" : undefined}
                onClick={() => setStep(s.n)}
              >
                <span className="eka-qs-circle" aria-hidden="true">{state === "done" ? "✓" : s.n}</span>
                <span className="eka-qs-stepper-label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className={"eka-qs-status eka-qs-status-" + status.kind} role="status" aria-live="polite">
        {status.text}
      </p>
      <div className="eka-qs-body">{renderStep()}</div>
      <div className="eka-qs-footer">
        <span className="eka-qs-sandbox">Sandbox: {BASE}</span>
        <button type="button" className="eka-qs-btn eka-qs-btn-quiet" onClick={startAgain}>Start again</button>
      </div>
    </div>
  );
};
