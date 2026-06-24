import { useState } from "react";

export const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      return;
    }
    window.open("http://eepurl.com/i3Lz2E", "_blank");
    setStatus("success");
    setEmail("");
  };

  return (
    <div style={{ background: "#E1F5EE", border: "1px solid #5DCAA5", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px" }}>
      <div style={{ fontSize: "15px", fontWeight: "600", color: "#085041", marginBottom: "4px" }}>
        Get weekly developer updates in your inbox
      </div>
      <div style={{ fontSize: "13px", color: "#0F6E56", marginBottom: "14px", lineHeight: "1.5" }}>
        New features, SDK releases, API changes, and bug fixes — delivered every week. No spam. Unsubscribe anytime.
      </div>
      {status === "success" ? (
        <div style={{ background: "#0F4C3A", color: "white", borderRadius: "8px", padding: "10px 16px", fontSize: "13px" }}>
          ✓ Check your inbox to confirm your subscription.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="your@email.com"
            required
            style={{
              flex: "1",
              minWidth: "200px",
              height: "38px",
              border: status === "error" ? "1.5px solid #E24B4A" : "1.5px solid #5DCAA5",
              borderRadius: "8px",
              padding: "0 14px",
              fontSize: "13px",
              color: "#111",
              background: "white",
              outline: "none"
            }}
          />
          <button
            type="submit"
            style={{ height: "38px", background: "#0F4C3A", color: "white", border: "none", borderRadius: "8px", padding: "0 20px", fontSize: "13px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Subscribe →
          </button>
        </form>
      )}
      {status === "error" && (
        <div style={{ fontSize: "11px", color: "#E24B4A", marginTop: "6px" }}>
          Please enter a valid email address.
        </div>
      )}
      <div style={{ fontSize: "11px", color: "#0F6E56", marginTop: "8px", opacity: "0.75" }}>
        Powered by Mailchimp · Your data is safe with us
      </div>
    </div>
  );
};

export default SubscribeForm;