"""Rebuild docs.json navigation as four product families (Mintlify `products`),
each with a menu of individual products, following the landing page.

    python3 scripts/build-nav.py            # rewrite docs.json in place
    python3 scripts/build-nav.py --check    # exit 1 if a page would be dropped

Also writes the files derived from the navigation: api-reference-link.js, the API index
and the landing page's developer journey (landing/source.html; then run
node scripts/build-landing.mjs).

Reads the existing navigation, so groups are moved, never rewritten. Every page
listed today must appear exactly once afterwards; --check enforces that.
"""
import json
import re
import sys

DOCS = 'docs.json'
ABDM = 'api-reference/user-app/abdm-connect/'


def walk_pages(x):
    if isinstance(x, str):
        yield x
    elif isinstance(x, dict):
        if x.get('root'):
            yield x['root']
        for k in ('pages', 'groups', 'tabs', 'anchors', 'menu', 'products'):
            for i in x.get(k, []):
                yield from walk_pages(i)
    elif isinstance(x, list):
        for i in x:
            yield from walk_pages(i)


def find(x, name, key='group'):
    if isinstance(x, dict):
        if x.get(key) == name:
            return x
        for v in x.values():
            r = find(v, name, key)
            if r:
                return r
    elif isinstance(x, list):
        for i in x:
            r = find(i, name, key)
            if r:
                return r
    return None


def take(nav, *path):
    """Find a group by a path of group names, e.g. take(nav, 'Doctor Tool', 'IPD API')."""
    node = nav
    for name in path:
        node = find(node, name)
        assert node, f'group not found: {path}'
    return json.loads(json.dumps(node))


def without(group, *names):
    g = json.loads(json.dumps(group))
    g['pages'] = [p for p in g['pages'] if not (isinstance(p, dict) and p['group'] in names)]
    return g


def pages_of(group):
    return {'group': group['group'], **({'icon': group['icon']} if group.get('icon') else {}), 'pages': group['pages']}


def build(d):
    nav = d['navigation']
    tab = lambda t: json.loads(json.dumps(find(nav, t, 'tab')))
    abdm = take(nav, 'ABDM Connect')
    abdm_top = [p for p in abdm['pages'] if isinstance(p, str)]
    sub = {p['group']: p for p in abdm['pages'] if isinstance(p, dict)}

    uhi_journeys = [p for p in sub['Journeys']['pages'] if '/uhi-' in p]
    uhi_workflows = find(sub['Workflows'], 'UHI')
    hie_journeys = {**sub['Journeys'], 'pages': [p for p in sub['Journeys']['pages'] if p not in uhi_journeys]}
    hie_workflows = {**sub['Workflows'], 'pages': [g for g in sub['Workflows']['pages'] if g['group'] != 'UHI']}

    scribe = tab('EkaScribe')
    spotlight = tab('Spotlight')
    sdks = tab('SDKs')
    ai_tools = tab('AI Tools')
    cookbook = tab('CookBook')
    changelog = find(nav, 'Changelog', 'anchor')
    product_details = take(nav, 'Product Details')
    pd = {p['group']: p for p in product_details['pages']}
    healthai = take(nav, 'HealthAI')
    doctor = take(nav, 'Doctor Tool')

    def item(name, icon, description, groups):
        return {'item': name, 'icon': icon, 'description': description, 'groups': groups}

    products = [
        {
            'product': 'AI', 'icon': 'sparkles',
            'description': 'Scribe, agents and clinical models that turn speech and documents into structured care.',
            'menu': [
                item('Scribe', 'waveform-lines', 'Consultations become structured notes',
                     [{'group': 'Guides', 'pages': ['docs/scribe/about', 'docs/scribe/ekascribe-link']}]
                     + scribe['groups']),
                item('Agents', 'robot', 'MedAssist, Agent Kit and MCP servers',
                     [{'group': 'Guides', 'pages': ['docs/agents/medassist'] + pd['MCP']['pages']},
                      pages_of(find(healthai, 'MedAssist'))] + ai_tools['groups']),
                item('Models', 'brain', 'Parsing, codification and assessments',
                     [{'group': 'Guides', 'pages': ['docs/models/medical-document-parsing',
                                                     'docs/models/medical-entity-codification']},
                      pages_of(find(healthai, 'Medical Document Parsing')),
                      pages_of(find(healthai, 'Medical Entity Codification')),
                      {'group': 'Eka MedAI research', 'pages': spotlight['pages']}]),
                item('Datasets', 'database', 'Drugs, labs, protocols and medical knowledge',
                     [{'group': 'Guides', 'pages': ['docs/datasets/medical-db']},
                      take(nav, 'Datasets'), take(nav, 'Medical Knowledge-bases'), take(nav, 'Medical Database')]),
            ],
        },
        {
            'product': 'Information Management', 'icon': 'folder-open',
            'description': 'Patients, appointments, admissions and billing, kept in one record your system reads and writes.',
            'menu': [
                item('EMR', 'stethoscope', 'Patients, appointments and prescriptions',
                     [{'group': 'Guides', 'pages': [x for x in pd['EMR']['pages'] if x != 'docs/billing/payments']}, pd['Console'],
                      without(doctor, 'IPD API', 'Payments API')]),
                item('IPD', 'bed-pulse', 'Admission, beds, nursing and discharge',
                     [pages_of(take(nav, 'Doctor Tool', 'IPD API'))]),
                item('Billing', 'receipt', 'Charges, deposits, invoices and payments',
                     [{'group': 'Guides', 'pages': ['docs/billing/payments']},
                      pages_of(take(nav, 'Doctor Tool', 'Payments API'))]),
                item('Health Records', 'file-medical', 'Records, cases and vitals on the patient\'s side',
                     [take(nav, 'Medical Records'), take(nav, 'User App')]),
            ],
        },
        {
            'product': 'ABDM', 'icon': 'hospital',
            'description': 'ABHA, consent and record exchange across India\'s health stack, plus insurance claims.',
            'menu': [
                item('HIE-CM', 'id-card', 'ABHA, care contexts, consent and records',
                     [{'group': 'Get started', 'pages': ['docs/hie-cm/about'] + abdm_top},
                      hie_journeys, hie_workflows]
                     + [g for n, g in sub.items() if n not in ('Journeys', 'Workflows', 'UHI', 'NHCX')]),
                item('NHCX', 'shield-heart', 'Eligibility, pre-auth and insurance claims', [sub['NHCX']]),
                item('UHI', 'magnifying-glass-location', 'Blood bank search and consultations across the network',
                     [{'group': 'Journeys', 'icon': 'route', 'pages': uhi_journeys},
                      {'group': 'Workflows', 'icon': 'diagram-project', 'pages': uhi_workflows['pages']},
                      sub['UHI']]),
            ],
        },
        {
            'product': 'Platform', 'icon': 'key',
            'description': 'The same keys, token and events for every product. This is where every integration starts.',
            'menu': [
                item('Get started', 'rocket', 'Overview, products and cookbook',
                     [take(nav, 'Eka Overview'), {'group': 'CookBook', 'pages': cookbook['groups'][0]['pages']},
                      {'group': 'Changelog', 'pages': changelog['pages'] + pd['Change Logs']['pages']}]),
                item('Auth', 'lock', 'Client credentials, OAuth2 and OIDC', [take(nav, 'Authorization')]),
                item('Webhooks', 'webhook', 'Register, receive and verify events', [take(nav, 'Webhooks')]),
                item('Encryption', 'shield-halved', 'End-to-end encryption and IP allowlisting',
                     [take(nav, 'Encryption'), pages_of(take(nav, 'Doctor Tool', 'IP Allowlisting'))]),
                item('SDKs', 'code', 'TypeScript, Python, Java, Go and mobile', sdks['groups']),
            ],
        },
    ]
    # IP Allowlisting moved to Encryption; drop it from EMR.
    emr = products[1]['menu'][0]['groups'][2]  # before shaping, items still use groups
    emr['pages'] = [p for p in emr['pages'] if not (isinstance(p, dict) and p['group'] == 'IP Allowlisting')]
    # The landing page's Lucide icons, vendored under images/icons/products/.
    for fam in products:
        for it in fam['menu']:
            it['icon'] = f"/images/icons/products/{ICONS[it['item']]}.svg"
    return {'products': products}


API_INDEX = 'api-sdk/index'

# Same icon per product as the landing page's Products menu (landing/index.html).
ICONS = {
    'Scribe': 'mic', 'Agents': 'bot', 'Models': 'brain-circuit', 'Datasets': 'database',
    'EMR': 'clipboard-list', 'IPD': 'bed-double', 'Billing': 'receipt', 'Health Records': 'folder-heart',
    'HIE-CM': 'arrow-left-right', 'NHCX': 'shield-check', 'UHI': 'network',
    'Get started': 'rocket', 'Auth': 'key-round', 'Webhooks': 'webhook', 'Encryption': 'lock', 'SDKs': 'code',
}

# Where the navbar "API Reference" button lands for each product: the product's
# API overview where one exists. Products not listed fall back to their first
# reference page, then to API_INDEX.
API_HOME = {
    'Auth': 'api-sdk/auth/getting-started',
    'Webhooks': 'api-sdk/webhooks/getting-started',
    'Encryption': 'docs/encryption/guide',
    'SDKs': 'api-sdk/sdks/sdks/web-sdk/getting-started',
    'Scribe': 'api-sdk/scribe/sessions/overview',
    'Agents': 'api-sdk/agents/overview',
    'Models': 'api-sdk/models/medical-document-parsing/introduction',
    'Datasets': 'api-sdk/datasets/overview',
    'EMR': 'api-sdk/emr/instructions/before-you-begin',
    'Health Records': 'api-sdk/health-records/create-overview',
    'HIE-CM': 'api-sdk/hie-cm/overview',
    'NHCX': 'docs/nhcx/getting-started',
    'UHI': 'docs/uhi/blood-bank/getting-started',
}
LINK_JS = 'api-reference-link.js'

# A group whose first page is its landing page gets that page as its `root`, so
# the section title opens it instead of listing a separate "Overview" under it.
LANDING = re.compile(r'(^|/)(overview|intro|introduction|getting-started|get-started|before-you-begin|guide|flows/m\d)$')

# Icon for a group or page, by the first keyword its title or path contains.
# Order matters: specific words before general ones.
ICON_RULES = [
    ('glossary', 'book'), ('changelog', 'clock-rotate-left'), ('change log', 'clock-rotate-left'),
    ('release', 'tag'), ('weekly', 'calendar-week'), ('under the hood', 'gears'),
    ('quickstart', 'bolt'), ('get started', 'rocket'), ('getting started', 'rocket'), ('before you begin', 'flag'),
    ('journey', 'route'), ('workflow', 'diagram-project'), ('webhook', 'webhook'), ('error', 'triangle-exclamation'),
    ('testing', 'flask'), ('sandbox', 'flask'), ('postman', 'paper-plane'),
    ('api reference', 'code'), ('apis', 'code'), ('sdk', 'box-open'), ('android', 'android'), ('ios', 'apple'),
    ('python', 'python'), ('java', 'java'), ('web', 'globe'), ('mobile', 'mobile'), ('backend', 'server'),
    ('mcp', 'plug'), ('agent', 'robot'), ('synapse', 'circle-nodes'), ('echo', 'robot'),
    ('auth', 'lock'), ('login', 'right-to-bracket'), ('token', 'key'), ('session', 'clock'), ('encryption', 'shield-halved'),
    ('ecdh', 'key'), ('ip allow', 'shield'), ('privacy', 'user-shield'), ('invite', 'user-plus'), ('byoa', 'id-badge'),
    ('abha', 'id-card'), ('aadhaar', 'fingerprint'), ('face', 'face-smile'), ('kyc', 'user-check'),
    ('profile', 'user'), ('card', 'id-card'), ('qr', 'qrcode'), ('scan', 'qrcode'), ('share', 'share-nodes'),
    ('care context', 'folder-tree'), ('discover', 'magnifying-glass'), ('link', 'link'), ('consent', 'file-signature'),
    ('pin', 'key'), ('auto approval', 'robot'), ('locker', 'vault'), ('subscription', 'bell'), ('request', 'inbox'),
    ('provider', 'hospital'), ('hpr', 'user-doctor'), ('hfr', 'hospital'), ('registr', 'clipboard-list'),
    ('facility', 'hospital'), ('onboard', 'door-open'), ('milestone', 'flag-checkered'), ('phr', 'mobile-screen'),
    ('nhcx', 'shield-heart'), ('claim', 'file-invoice-dollar'), ('policy', 'file-contract'), ('payer', 'building-columns'),
    ('preauth', 'file-shield'), ('pre-auth', 'file-shield'), ('eligib', 'circle-check'), ('biometric', 'fingerprint'),
    ('uhi', 'network-wired'), ('blood', 'droplet'), ('consultation', 'user-doctor'), ('booking', 'calendar-check'),
    ('slot', 'calendar'), ('doctor', 'user-doctor'), ('scan & pay', 'qrcode'), ('pay', 'credit-card'),
    ('billing', 'receipt'), ('invoice', 'file-invoice'), ('ipd', 'bed-pulse'), ('admission', 'bed'),
    ('bed', 'bed'), ('room', 'door-closed'), ('nursing', 'user-nurse'), ('discharge', 'file-medical'),
    ('rate plan', 'tags'), ('categor', 'layer-group'), ('order', 'cart-shopping'), ('pharmac', 'prescription-bottle-medical'),
    ('dawakhana', 'prescription-bottle-medical'), ('prescription', 'prescription'), ('appointment', 'calendar-check'),
    ('patient', 'hospital-user'), ('clinic', 'house-medical'), ('config', 'sliders'), ('actor', 'users'),
    ('instruction', 'list-check'), ('notif', 'bell'), ('vital', 'heart-pulse'),
    ('record', 'file-medical'), ('document', 'file-lines'), ('parsing', 'file-magnifying-glass'),
    ('codification', 'tags'), ('snomed', 'tags'), ('loinc', 'vial'), ('icd', 'tags'), ('medication', 'pills'),
    ('protocol', 'book-medical'), ('knowledge', 'book-open-cover'), ('dataset', 'database'), ('database', 'database'),
    ('ontology', 'sitemap'), ('medassist', 'comments'), ('assessment', 'clipboard-question'), ('scribe', 'microphone'),
    ('template', 'file-pen'), ('fhir', 'fire'), ('model', 'brain'), ('research', 'flask-vial'), ('technolog', 'microchip'),
    ('spotlight', 'star'), ('asset', 'box-archive'), ('console', 'terminal'), ('cookbook', 'utensils'),
    ('what', 'lightbulb'), ('product', 'cubes'), ('open source', 'code-branch'), ('overview', 'compass'),
    ('reference', 'book'), ('resource', 'folder-open'), ('tool', 'screwdriver-wrench'), ('data', 'database'),
    ('search', 'magnifying-glass'), ('create', 'plus'), ('update', 'pen'), ('delete', 'trash'), ('list', 'list'),
    ('get', 'download'), ('add', 'plus'), ('read', 'eye'), ('setup', 'gear'), ('status', 'signal'),
]
DEFAULT_GROUP_ICON = 'folder'
# Group names too short or generic for the keyword rules.
GROUP_ICONS = {'Guides': 'book-open', 'HIP': 'hospital', 'HIU': 'magnifying-glass-chart', 'PHR': 'mobile-screen',
               'Eka User': 'user', 'Schedule': 'calendar', 'Events': 'bolt', 'User App': 'mobile'}
DEFAULT_PAGE_ICON = 'file-lines'
# Pages that sit side by side in one sidebar get distinct icons by hand.
PAGE_ICONS = {
    'journeys/hip-register-patient-and-link-visit': 'hospital-user', 'journeys/hip-answer-discovery': 'clock-rotate-left',
    'journeys/hiu-fetch-records-with-consent': 'file-import', 'journeys/phr-patient-aggregates-records': 'mobile-screen',
    'journeys/facility-onboard-to-abdm': 'hospital', 'journeys/uhi-book-physical-consultation': 'calendar-check',
    'journeys/uhi-scan-and-pay': 'qrcode',
    'workflows/login-abha': 'right-to-bracket', 'workflows/create-abha-aadhaar-otp': 'fingerprint',
    'workflows/create-abha-mobile-otp': 'mobile', 'workflows/create-abha-face-auth': 'face-smile',
    'workflows/hold-gateway-session': 'hourglass-half', 'workflows/manage-profile-and-kyc': 'user-check',
    'workflows/link-care-context-hip': 'link', 'workflows/serve-data-on-fetch': 'file-export',
    'workflows/hip-scan-and-share': 'qrcode', 'workflows/hip-discovery-and-link': 'magnifying-glass',
    'workflows/hiu-request-consent': 'file-signature', 'workflows/hiu-receive-data': 'unlock',
    'workflows/phr-discover-and-link': 'magnifying-glass-plus', 'workflows/phr-list-records': 'list',
    'workflows/phr-act-on-consent': 'thumbs-up', 'workflows/set-up-health-locker': 'vault',
    'workflows/phr-scan-and-share': 'share-nodes', 'workflows/create-hpr-id': 'user-doctor',
    'workflows/hpr-mobile-login': 'mobile-retro', 'workflows/register-hfr': 'house-medical',
    'workflows/uhi-book-consultation': 'stethoscope', 'workflows/scan-and-pay': 'credit-card',
    'workflows/blood-bank-search': 'droplet',
    'quickstart': 'bolt', 'testing': 'flask', 'webhooks': 'webhook', 'changelog': 'clock-rotate-left',
    'errors': 'triangle-exclamation', 'overview': 'compass',
}


# HIE-CM's sidebar, three levels at most: section -> group -> page.
HIECM_TAG_ORDER = ['Session', 'Aadhaar Registration', 'Mobile Registration', 'Face Auth Registration',
                   'Registration Utilities', 'Login', 'Profile', 'Scan and Share', 'Care Contexts',
                   'Patient Requests', 'Providers', 'Consents', 'HPR and HFR']
HIECM_TAG_ICONS = {'Session': 'hourglass-half', 'Aadhaar Registration': 'fingerprint', 'Mobile Registration': 'mobile',
                   'Face Auth Registration': 'face-smile', 'Registration Utilities': 'toolbox', 'Login': 'right-to-bracket',
                   'Profile': 'user', 'Scan and Share': 'qrcode', 'Care Contexts': 'folder-tree',
                   'Patient Requests': 'inbox', 'Providers': 'hospital', 'Consents': 'file-signature',
                   'HPR and HFR': 'user-doctor'}
# CARE: the four milestones as Create, Attach, Retrieve, Enrol.
MILESTONE_GUIDES = [('Milestone 1', 'Create: ABHA (M1)', 'flows/m1'), ('Milestone 2', 'Attach: records (M2)', 'flows/m2'),
                    ('Milestone 3', 'Retrieve: with consent (M3)', 'flows/m3'), ('Milestone 4', 'Enrol: registries (M4)', 'flows/m4'),
                    ('PHR App', 'PHR app', 'phr/overview')]


def spec_tags(spec_path):
    import yaml
    spec = yaml.safe_load(open(spec_path))
    out = {}
    for path, item in spec.get('paths', {}).items():
        for method, op in item.items():
            if isinstance(op, dict) and op.get('tags'):
                out[f'{method.upper()} {path}'] = op['tags'][0]
    return out


def operation_of(page):
    head = open(page + '.mdx').read(600)
    m = re.search(r'^openapi:\s*"?([^"\n]+)"?', head, re.M)
    if not m:
        return None
    toks = m.group(1).split()
    return f'{toks[-2].upper()} {toks[-1]}'


def restructure_hiecm(item):
    """Get started, Journeys, Workflows, Guides, API reference, Webhooks, Resources."""
    entries = item.get('pages') or item.get('groups')
    by_name = {e['group']: e for e in entries if isinstance(e, dict)}
    tags = spec_tags(ABDM + 'registration.yml')
    guides, by_tag, webhooks, sdks = [], {}, [], []
    for name, label, root in MILESTONE_GUIDES:
        g = by_name.get(name)
        if not g:
            continue
        pages = [p for p in walk_pages(g) if p != ABDM + root]
        guide_pages = []
        for p in pages:
            if is_reference(p):
                by_tag.setdefault(tags.get(operation_of(p), 'Other'), []).append(p)
            elif '/webhooks/' in p:
                webhooks.append(p)
            elif p.lower().startswith('sdks/') or '/sdks/' in p.lower() or 'sdk' in p.split('/')[-1].lower():
                sdks.append(p)
            else:
                guide_pages.append(p)
        guides.append({'group': label, 'icon': g.get('icon', 'flag-checkered'), 'root': ABDM + root, 'pages': guide_pages})
    reference = [{'group': t, 'icon': HIECM_TAG_ICONS.get(t, 'code'), 'pages': by_tag[t]}
                 for t in HIECM_TAG_ORDER + sorted(set(by_tag) - set(HIECM_TAG_ORDER)) if t in by_tag]
    handled = {'Get started', 'Journeys', 'Workflows'} | {n for n, _, _ in MILESTONE_GUIDES}
    top = [e for e in entries if isinstance(e, str)]
    top += [p for e in entries if isinstance(e, dict) and e['group'] not in handled for p in walk_pages(e)]
    keep = [json.loads(json.dumps(by_name[n])) for n in ('Get started', 'Journeys', 'Workflows') if n in by_name]
    errors_page = ABDM + 'errors'
    for g in keep:
        g['pages'] = [p for p in g['pages'] if p != errors_page]
    top.insert(0, errors_page)
    webhooks_index = next((p for p in top if p.endswith('/webhooks')), None)
    resources = [p for p in top if p != webhooks_index] + ([{'group': 'SDKs', 'icon': 'box-open', 'pages': sdks}] if sdks else [])
    sections = keep + [
        {'group': 'Guides', 'pages': guides},
        {'group': 'API reference', 'pages': reference},
        {'group': 'Webhooks', 'pages': ([{'group': 'Events', 'icon': 'bell', 'root': webhooks_index, 'pages': webhooks}]
                                        if webhooks_index else webhooks)},
        {'group': 'Resources', 'pages': resources},
    ]
    used = set(walk_pages(sections))
    assert used == set(walk_pages(entries)), sorted(set(walk_pages(entries)) - used)[:5]
    item.pop('groups', None)
    item['pages'] = sections


# The API reference is its own division, like docs.stripe.com/api: one sidebar,
# one section per product, then tag groups, then endpoints. Product sidebars keep
# the docs. Each product's API overview page opens its section.
API_DIVISION = 'API Reference'  # legacy single division, replaced by API families
API_LABEL = 'API and SDKs'  # the navbar link into the API reference
API_SUFFIX = ' API'  # the API Reference has one family per docs family: "AI API", "ABDM API", ...


def is_api_family(fam):
    return fam['product'].endswith(API_SUFFIX) or fam['product'] == API_DIVISION
API_SECTION_HOME = {
    'HIE-CM': 'api-sdk/hie-cm/overview',
    'Scribe': 'api-sdk/scribe/sessions/overview',
    'Agents': 'api-sdk/agents/overview',
    'Models': 'api-sdk/models/medical-document-parsing/introduction',
    'Datasets': 'api-sdk/datasets/overview',
    'EMR': 'api-sdk/emr/instructions/before-you-begin',
    'Health Records': 'api-sdk/health-records/create-overview',
    'Auth': 'api-sdk/auth/getting-started',
    'Webhooks': 'api-sdk/webhooks/getting-started',
}


def take_pages(node, keep):
    """Split `node` into (kept, rest): kept holds the pages `keep` accepts, in the
    same group structure; rest holds everything else. Empty groups are dropped."""
    if isinstance(node, str):
        return (node, None) if keep(node) else (None, node)
    kept_pages, rest_pages = [], []
    for c in node.get('pages', []):
        k, r = take_pages(c, keep)
        if k is not None:
            kept_pages.append(k)
        if r is not None:
            rest_pages.append(r)
    root = node.get('root')
    def rebuild(pages, with_root):
        if not pages and not with_root:
            return None
        g = {k: v for k, v in node.items() if k not in ('pages', 'root')}
        if with_root:
            g['root'] = root
        g['pages'] = pages
        return g
    root_kept = bool(root) and keep(root)
    return rebuild(kept_pages, root_kept), rebuild(rest_pages, bool(root) and not root_kept)


def flatten(node, depth):
    """Inside the API reference keep section -> group -> endpoint: groups deeper
    than `depth` hand their pages up to the group above."""
    if isinstance(node, str):
        return [node]
    if depth <= 0:
        return list(walk_pages(node))
    pages = []
    for c in node.get('pages', []):
        if isinstance(c, dict) and depth == 1:
            pages.extend(walk_pages(c))
        elif isinstance(c, dict):
            inner = ([c['root']] if c.get('root') else []) + flatten(c, depth - 1)
            pages.append({**{k: v for k, v in c.items() if k not in ('pages', 'root')}, 'pages': inner})
        else:
            pages.append(c)
    return pages


def split_api(products):
    """Move endpoint pages out of each docs product into its API twin. The API
    Reference mirrors the docs picker: one family per docs family, one product
    per docs product, each with a sidebar of its own."""
    if any(is_api_family(p) for p in products):
        return
    api_families = []
    for fam in products:
        api_items = []
        for it in fam['menu']:
            home = API_SECTION_HOME.get(it['item'])
            keep = lambda p, home=home: is_reference(p) or p == home
            kept, rest = [], []
            for e in it['pages']:
                k, r = take_pages(e, keep)
                if k is not None:
                    kept.append(k)
                if r is not None:
                    rest.append(r)
            if not kept:
                continue
            drop_home = lambda e, home=home: e if isinstance(e, str) else {**e, 'pages': [x for x in (drop_home(y) for y in e['pages']) if x and x != home]}
            nonempty = lambda e: isinstance(e, str) or e['pages'] or e.get('root')
            kept = [x for x in (drop_home(e) for e in kept) if x and x != home and nonempty(x)]
            # One wrapper group (HIE-CM's "API reference", NHCX's "NHCX") lists its children directly.
            while len(kept) == 1 and isinstance(kept[0], dict):
                kept = ([kept[0]['root']] if kept[0].get('root') else []) + kept[0]['pages']
            body = [x for x in (drop_home(e) for e in flatten({'pages': kept}, 2)) if x != home and (isinstance(x, str) or x['pages'])]
            api_items.append({'item': it['item'] + API_SUFFIX, 'icon': it.get('icon', 'code'),
                              'description': it.get('description', ''), 'pages': ([home] if home else []) + body})
            it['pages'] = rest
            if not rest:
                it.pop('pages')
                it['href'] = '/' + next(walk_pages(api_items[-1]))
        if api_items:
            api_families.append({'product': fam['product'] + API_SUFFIX, 'icon': fam.get('icon', 'code'),
                                 'description': fam.get('description', ''), 'menu': api_items})
    if API_INDEX in set(walk_pages(products)):
        for fam in products:
            for it in fam['menu']:
                if 'pages' in it:
                    it['pages'] = [x for x in (take_pages(e, lambda p: p != API_INDEX)[0] for e in it['pages']) if x is not None]
        platform = next(f for f in api_families if f['product'] == 'Platform' + API_SUFFIX)
        platform['menu'].insert(0, {'item': 'All APIs', 'icon': '/images/icons/products/code.svg',
                                    'description': 'Every Eka API, by product', 'pages': [API_INDEX]})
    products.extend(api_families)


# Font Awesome stand-ins for the product icons, for API section headers.
ICONS_FA = {'Scribe': 'microphone', 'Agents': 'robot', 'Models': 'brain', 'Datasets': 'database', 'EMR': 'clipboard-list',
            'IPD': 'bed', 'Billing': 'receipt', 'Health Records': 'folder-open', 'HIE-CM': 'arrow-right-arrow-left',
            'NHCX': 'shield-heart', 'UHI': 'network-wired', 'Auth': 'key', 'Webhooks': 'webhook'}


def page_meta(page):
    try:
        src = open(page + '.mdx').read()
    except FileNotFoundError:
        return {}
    m = re.match(r'---\n([\s\S]*?)\n---', src)
    meta = {}
    for line in (m.group(1).splitlines() if m else []):
        k = re.match(r'(\w+):\s*(.*)$', line)
        if k:
            meta[k.group(1)] = k.group(2).strip().strip('"\'')
    return meta


def pick_icon(*texts, default):
    hay = ' '.join(t.lower().replace('-', ' ').replace('_', ' ') for t in texts if t)
    for word, icon in ICON_RULES:
        if word in hay:
            return icon
    return default


def shape(node):
    """Give every group an icon; make each section's landing page its root;
    collapse a group left with only its root, or a single page, into that page."""
    if not isinstance(node, dict) or 'group' not in node:
        return node
    pages = node.get('pages', [])
    if 'root' not in node and pages and isinstance(pages[0], str) and LANDING.search(pages[0]):
        node['root'], pages = pages[0], pages[1:]
    node['pages'] = [shape(p) for p in pages]
    node.setdefault('icon', GROUP_ICONS.get(node['group']) or pick_icon(node['group'], default=DEFAULT_GROUP_ICON))
    if not node['pages'] and node.get('root'):
        return node['root']
    if 'root' not in node and len(node['pages']) == 1 and isinstance(node['pages'][0], str):
        return node['pages'][0]
    return node


def wrap(item):
    """Put a product's sections, docs or API, inside one group named after the
    product. Mintlify never collapses a top-level group, so this is what lets Get
    started, Journeys, Workflows and the rest fold. The first section starts open;
    the rest start closed, and Mintlify opens whichever holds the current page."""
    pages = item.get('pages')
    if not pages or is_wrapped(item, pages):
        return
    first = next((e for e in pages if isinstance(e, dict) and 'group' in e), None)
    if first is not None:
        first['expanded'] = True
    item['pages'] = [{'group': item['item'], 'pages': pages}]


def is_wrapped(item, pages):
    return len(pages) == 1 and isinstance(pages[0], dict) and pages[0].get('group') == item['item'] \
        and 'icon' not in pages[0]


def unwrap(item, pages):
    """Undo wrap(), so a rebuild reshapes the sections, not the wrapper."""
    return pages[0]['pages'] if is_wrapped(item, pages) else pages


def is_reference(page):
    try:
        head = open(page + '.mdx').read(600)
    except FileNotFoundError:
        return False
    return head.startswith('---') and '\nopenapi:' in head.split('\n---', 1)[0]


def reference_targets(products):
    """Each docs product's first page in its API twin, a map from every page to
    it, and the set of pages inside the API Reference (for the picker)."""
    twins = {it['item'][:-len(API_SUFFIX)]: it for fam in products if is_api_family(fam)
             for it in fam['menu'] if it['item'].endswith(API_SUFFIX)}
    targets, page_map = [], {}
    for fam in products:
        if is_api_family(fam):
            continue
        for it in fam['menu']:
            twin = twins.get(it['item'])
            first = next(walk_pages(twin), None) if twin else None
            targets.append((fam['product'], it['item'], it.get('description', ''), first))
            for p in list(walk_pages(it)) + (list(walk_pages(twin)) if twin else []):
                page_map['/' + p] = '/' + first if first else '/' + API_INDEX
    page_map['/' + API_INDEX] = '/' + API_INDEX
    return targets, page_map


def align_areas(products):
    """A page's sidebar follows its URL: /api-sdk/ pages belong to the product's
    API twin, /docs/ pages to its docs side. Moves any page in the wrong one."""
    api_items = {it['item'][:-len(API_SUFFIX)]: it for fam in products if is_api_family(fam)
                 for it in fam['menu'] if it['item'].endswith(API_SUFFIX)}
    for fam in products:
        if is_api_family(fam):
            continue
        for it in fam['menu']:
            if 'pages' not in it:
                continue
            kept, rest = [], []
            for e in it['pages']:
                k, r = take_pages(e, lambda p: p.startswith('api-sdk/'))
                if k is not None:
                    kept.append(k)
                if r is not None:
                    rest.append(r)
            if not kept:
                continue
            twin = api_items.get(it['item'])
            if twin is None:
                api_fam = next(f for f in products if f['product'] == fam['product'] + API_SUFFIX)
                twin = {'item': it['item'] + API_SUFFIX, 'icon': it.get('icon', 'code'),
                        'description': it.get('description', ''), 'pages': []}
                api_fam['menu'].append(twin)
            sdk_pages = [p for e in kept for p in walk_pages(e)]
            twin['pages'] = [e for e in twin['pages'] if not (isinstance(e, dict) and e.get('group') == 'SDKs')]
            twin['pages'].append({'group': 'SDKs', 'icon': 'box-open', 'pages': sdk_pages})
            it['pages'] = rest
            if not rest:
                it.pop('pages')
                it['href'] = '/' + next(walk_pages(twin))


def docs_targets(products):
    """Map every API Reference page to its product's first docs page."""
    docs = {it['item']: it for fam in products if not is_api_family(fam) for it in fam['menu']}
    out = {}
    for name, it in docs.items():  # within the docs, Docs goes to the product's own first page
        home = it.get('href', '').lstrip('/') or next(walk_pages(it), None)
        for p in walk_pages(it):
            out['/' + p] = '/' + home
    for fam in products:
        if not is_api_family(fam):
            continue
        for it in fam['menu']:
            twin = docs.get(it['item'][:-len(API_SUFFIX)]) if it['item'].endswith(API_SUFFIX) else None
            home = (twin.get('href', '').lstrip('/') or next(walk_pages(twin), None)) if twin else None
            for p in walk_pages(it):
                out['/' + p] = '/' + (home or 'docs/get-started/overview')
    return out


def api_pages(products):
    return sorted('/' + p for fam in products if is_api_family(fam) for p in walk_pages(fam))


def write_link_js(page_map, in_api=(), docs_map=None):
    body = f'''// Generated by scripts/build-nav.py. Do not edit.
// Points the navbar "API Reference" link at the current product's reference.
(function () {{
  var MAP = {json.dumps(page_map, separators=(',', ':'))};
  var FALLBACK = "/{API_INDEX}";
  var API_LABEL = "{API_LABEL}";
  var API = new Set({json.dumps(list(in_api), separators=(',', ':'))});
  var DOCS = {json.dumps(docs_map or {}, separators=(',', ':'))};
  function here() {{ return window.location.pathname.replace(/\\/$/, ""); }}
  // The navbar's "API Reference" and "Docs" links follow the product you are in.
  function target(label) {{
    if (label === "Docs") return DOCS[here()] || "/docs/get-started/overview";
    return MAP[here()] || FALLBACK;
  }}
  function labelOf(a) {{
    if (!a || !a.closest("header, nav, #navbar")) return null;
    var t = a.textContent.trim();
    return t === API_LABEL || t === "Docs" ? t : null;
  }}
  function update() {{
    // In the API Reference the product picker shows the API families; elsewhere the docs families.
    document.documentElement.classList.toggle("eka-api-mode", here().indexOf("/api-sdk/") === 0 || API.has(here()));
    document.querySelectorAll("a").forEach(function (a) {{
      var l = labelOf(a);
      if (l) a.setAttribute("href", target(l));
    }});
  }}
  // The site router navigates by the link's original address, so take the click first.
  document.addEventListener("click", function (e) {{
    var a = e.target.closest && e.target.closest("a");
    var l = labelOf(a);
    if (!l || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.assign(target(l));
  }}, true);
  window.addEventListener("mintlify:navigate", function () {{ setTimeout(update, 0); }});
  window.addEventListener("popstate", update);
  document.addEventListener("DOMContentLoaded", update);
  setInterval(update, 1000);
}})();
'''
    open(LINK_JS, 'w').write(body)


def write_index(targets):
    lines = ['---', 'title: "API Reference"',
             'description: "Every Eka API, by product family. Each product\'s reference starts from the link below."',
             'type: guide', '---', '',
             '{/* Generated by scripts/build-nav.py from docs.json. Do not edit by hand. */}', '']
    fam = None
    for family, product, desc, first in targets:
        if not first:
            continue
        if family != fam:
            if fam:
                lines += ['</CardGroup>', '']
            lines += [f'## {family}', '', '<CardGroup cols={2}>']
            fam = family
        lines += [f'  <Card title="{product}" href="/{first}">', f'    {desc}', '  </Card>']
    lines += ['</CardGroup>', '']
    open(API_INDEX + '.mdx', 'w').write('\n'.join(lines))


# ---------- Landing page developer journey ----------
# The landing page's journey (landing/source.html, const J) follows each product's docs
# sidebar: one step per sidebar section, in order and by its name, so it cannot drift from
# the docs. A product with no docs pages gets a single step labelled API reference.
LANDING_HTML = 'landing/source.html'
JOURNEY_CARDS = 8  # per step; past that the last card says how many more the section holds
# Font Awesome (docs) to Lucide (landing page) for the icons the docs use; others fall back.
FA_LUCIDE = {
    'file-lines': 'file-text', 'rocket': 'rocket', 'compass': 'compass', 'bolt': 'zap', 'clock-rotate-left': 'history',
    'calendar-check': 'calendar-check', 'plug': 'plug', 'tags': 'tags', 'tag': 'tag', 'screwdriver-wrench': 'wrench',
    'hospital': 'hospital', 'database': 'database', 'user-doctor': 'stethoscope', 'stethoscope': 'stethoscope',
    'magnifying-glass': 'search', 'magnifying-glass-plus': 'search', 'flag-checkered': 'flag', 'folder-tree': 'folder-tree',
    'webhook': 'webhook', 'code': 'code', 'sliders': 'sliders-horizontal', 'lock': 'lock', 'unlock': 'lock-open',
    'hospital-user': 'contact', 'qrcode': 'qr-code', 'file-signature': 'file-signature', 'microphone': 'mic',
    'microphone-lines': 'mic', 'globe': 'globe', 'fire': 'flame', 'shield': 'shield', 'shield-halved': 'shield',
    'download': 'download', 'gear': 'settings', 'gears': 'settings', 'book': 'book-open', 'book-open': 'book-open',
    'book-open-cover': 'book-open', 'book-medical': 'book-heart', 'pills': 'pill', 'prescription': 'pill',
    'house-medical': 'house-plus', 'credit-card': 'credit-card', 'file-medical': 'file-heart', 'mobile-screen': 'smartphone',
    'mobile': 'smartphone', 'mobile-retro': 'smartphone', 'mobile-screen-button': 'smartphone', 'vault': 'vault',
    'id-card': 'id-card', 'inbox': 'inbox', 'calendar-week': 'calendar', 'calendar': 'calendar', 'comments': 'messages-square',
    'robot': 'bot', 'box-open': 'package', 'cube': 'box', 'cubes': 'boxes', 'star': 'star', 'brain': 'brain',
    'folder-open': 'folder-open', 'vial': 'test-tube', 'flask': 'flask-conical', 'flask-vial': 'flask-conical',
    'file-import': 'file-input', 'file-export': 'file-output', 'right-to-bracket': 'log-in', 'fingerprint': 'fingerprint',
    'face-smile': 'smile', 'hourglass-half': 'hourglass', 'user-check': 'user-check', 'user': 'user', 'user-plus': 'user-plus',
    'link': 'link', 'list': 'list', 'thumbs-up': 'thumbs-up', 'share-nodes': 'share-2', 'key': 'key-round', 'bell': 'bell',
    'circle-exclamation': 'circle-alert', 'droplet': 'droplet', 'code-branch': 'git-branch', 'clipboard-question': 'clipboard',
    'route': 'route', 'diagram-project': 'workflow', 'react': 'atom', 'server': 'server', 'terminal': 'terminal',
    'microchip': 'cpu', 'laptop-binary': 'laptop', 'box-archive': 'archive', 'network-wired': 'network',
    'handshake': 'handshake', 'building-columns': 'landmark', 'utensils': 'utensils', 'java': 'coffee',
}


def lucide(fa):
    return FA_LUCIDE.get(fa or '', 'file-text')


def card_of(entry):
    """One journey card: a page, or a nested group opening its root or first page."""
    if isinstance(entry, str):
        meta = page_meta(entry)
        return [meta.get('sidebarTitle') or meta.get('title') or entry.split('/')[-1], '/' + entry, lucide(meta.get('icon'))]
    first = next(walk_pages(entry), None)
    return [entry['group'], '/' + first, lucide(entry.get('icon'))] if first else None


def step_of(name, entries):
    cards = [c for c in (card_of(e) for e in entries) if c]
    if len(cards) > JOURNEY_CARDS:
        more = len(cards) - (JOURNEY_CARDS - 1)
        cards = cards[:JOURNEY_CARDS - 1] + [[f'{more} more in {name}', cards[JOURNEY_CARDS - 1][1], 'ellipsis']]
    return [name, cards]


def journey(products):
    api = {it['item'][:-len(API_SUFFIX)]: it for fam in products if is_api_family(fam)
           for it in fam['menu'] if it['item'].endswith(API_SUFFIX)}
    J = {}
    for fam in products:
        if is_api_family(fam):
            continue
        J[fam['product']] = prods = {}
        for it in fam['menu']:
            pages = it.get('pages')
            if not pages:
                twin = api.get(it['item'])
                first = next(walk_pages(twin), None) if twin else it.get('href', '/').lstrip('/')
                prods[it['item']] = [['API reference', [[f"{it['item']} API reference", '/' + first, 'code']]]]
                continue
            steps, loose = [], []
            for e in unwrap(it, pages):
                if isinstance(e, dict):
                    if loose:
                        steps.append(step_of(it['item'], loose))
                        loose = []
                    steps.append(step_of(e['group'], ([e['root']] if e.get('root') else []) + e['pages']))
                else:
                    loose.append(e)
            if loose:
                steps.append(step_of(it['item'], loose))
            prods[it['item']] = steps
    return J


def write_journey(products):
    src = open(LANDING_HTML).read()
    start = src.index('const J=')
    end = src.index('\n', src.index('BASE="";', start))
    block = ('const J=' + json.dumps(journey(products), ensure_ascii=False, separators=(',', ':')) + ';\n'
             '  // const J is written by scripts/build-nav.py from docs.json: one step per docs sidebar section.\n'
             '  const BASE="";')
    open(LANDING_HTML, 'w').write(src[:start] + block + src[end:])


def open_ok(page):
    try:
        open(page + '.mdx').close()
        return True
    except FileNotFoundError:
        return False


def set_page_icons(products):
    """Add `icon:` to every listed page that has none. Endpoint pages are skipped:
    Mintlify shows their HTTP method badge where the icon would go."""
    changed = 0
    for page in sorted(set(walk_pages(products))):
        path = page + '.mdx'
        try:
            src = open(path).read()
        except FileNotFoundError:
            continue
        m = re.match(r'---\n([\s\S]*?)\n---', src)
        if not m or re.search(r'^(icon|openapi):', m.group(1), re.M):
            continue
        meta = page_meta(page)
        key = page.split('docs/hie-cm/', 1)[-1] if page.startswith('docs/hie-cm/') else None
        icon = PAGE_ICONS.get(key) if key else None
        icon = icon or pick_icon(meta.get('sidebarTitle', ''), meta.get('title', ''), page.split('/')[-1],
                         default=DEFAULT_PAGE_ICON)
        open(path, 'w').write(src.replace('---\n', f'---\nicon: "{icon}"\n', 1))
        changed += 1
    print(f'page icons added: {changed}')


def main():
    d = json.load(open(DOCS))
    if 'products' in d['navigation']:
        new = d['navigation']  # already built: only regenerate the derived files
    else:
        before = set(walk_pages(d['navigation']))
        new = build(d)
        after = list(walk_pages(new))
        dropped = sorted(before - set(after))
        dupes = sorted({p for p in after if after.count(p) > 1})
        print(f'pages before {len(before)}, after {len(set(after))}, dropped {len(dropped)}, duplicated {len(dupes)}')
        for p in dropped[:20]:
            print('  dropped:', p)
        for p in dupes[:20]:
            print('  duplicate:', p)
        if dropped or dupes:
            sys.exit(1)
        if '--check' in sys.argv:
            return
    get_started = next(f for f in new['products'] if f['product'] == 'Platform')['menu'][0]
    gs = get_started.get('pages') or get_started.get('groups')
    gs_pages = gs[0]['pages'] if isinstance(gs[0], dict) else gs
    if API_INDEX not in set(walk_pages(new)):
        gs_pages.insert(1, API_INDEX)
    glossary = 'docs/get-started/glossary'
    if open_ok(glossary) and glossary not in set(walk_pages(new)):
        gs_pages.insert(2, glossary)
    links = [l for l in d['navbar'].setdefault('links', []) if l.get('label') not in ('API Reference', API_LABEL, 'Docs')]
    # Order matters: styles.css shows only one of these two by URL (Docs on /api-sdk/, API and SDKs elsewhere).
    d['navbar']['links'] = [{'label': 'Docs', 'href': '/docs/get-started/overview'},
                            {'label': API_LABEL, 'href': '/' + API_INDEX}] + links
    for fam in new['products']:
        for it in fam['menu']:
            if is_api_family(fam) or 'href' in it:
                continue
            if it['item'] == 'HIE-CM' and any(isinstance(e, dict) and e.get('group') == 'Milestone 1' for e in it.get('pages', []) + it.get('groups', [])):
                restructure_hiecm(it)
            entries = [shape(g) for g in unwrap(it, it.pop('groups', it.pop('pages', [])))]
            # Entries go in `pages`, not `groups`: Mintlify honours a group's
            # `root` only on nested groups, and `pages` may mix pages and groups,
            # so every section title can be its own page.
            it['pages'] = entries
    for fam in new['products']:
        if is_api_family(fam):
            for it in fam['menu']:
                if it.get('pages'):
                    it['pages'] = unwrap(it, it['pages'])
    split_api(new['products'])
    align_areas(new['products'])
    for _ in range(5):  # shape until nothing changes, so one run gives the final tree
        before = json.dumps(new)
        for fam in new['products']:
            if not is_api_family(fam):
                for it in fam['menu']:
                    if it.get('pages'):
                        it['pages'] = [shape(e) for e in unwrap(it, it['pages'])]
        if json.dumps(new) == before:
            break
    for fam in new['products']:
        for it in fam['menu']:
            wrap(it)
    if '--page-icons' in sys.argv:
        set_page_icons(new['products'])
    targets, page_map = reference_targets(new['products'])
    write_link_js(page_map, api_pages(new['products']), docs_targets(new['products']))
    write_index(targets)
    write_journey(new['products'])
    d['navigation'] = new
    json.dump(d, open(DOCS, 'w'), indent=2, ensure_ascii=False)
    open(DOCS, 'a').write('\n')
    print(f'{len(targets)} products, {sum(1 for t in targets if t[3])} with a reference; {len(page_map)} pages mapped')


if __name__ == '__main__':
    main()
