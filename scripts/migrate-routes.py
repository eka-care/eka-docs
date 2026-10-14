"""One-time move of every page in the navigation to product routes:

    /docs/<product>/...      guides, journeys, workflows, resources
    /api-sdk/<product>/...   API reference and SDK pages

    python3 scripts/migrate-routes.py            # dry run: print the plan and collisions
    python3 scripts/migrate-routes.py --apply    # git mv, rewrite links, add redirects

Pages not in the navigation stay where they are. Every moved page gets a
permanent redirect from its old URL. The mapping is written to
scripts/route-map.json so later tools can trace an old path.
"""
import json
import os
import re
import subprocess
import sys

DOCS = 'docs.json'
API_SUFFIX = ' API'

SLUGS = {
    'Scribe': 'scribe', 'Agents': 'agents', 'Models': 'models', 'Datasets': 'datasets',
    'EMR': 'emr', 'IPD': 'ipd', 'Billing': 'billing', 'Health Records': 'health-records',
    'HIE-CM': 'hie-cm', 'NHCX': 'nhcx', 'UHI': 'uhi',
    'Get started': 'get-started', 'Auth': 'auth', 'Webhooks': 'webhooks', 'Encryption': 'encryption',
    'SDKs': 'sdks', 'All APIs': None,
}

# Landing pages whose file name says little once it sits under the product.
OVERRIDES = {
    'integrations/interoperability/abdm': 'docs/hie-cm/about',
    'integrations/health-ai/ekascribe': 'docs/scribe/about',
    'user-guides/get-started': 'docs/get-started/overview',
}

# Folder prefixes stripped before a page's remaining path is kept, longest first.
CONTENT_ROOTS = sorted([
    'api-reference/user-app/abdm-connect/nhcx/', 'api-reference/user-app/abdm-connect/', 'api-reference/user-app/records/',
    'api-reference/user-app/', 'api-reference/doc-tool/ipd-api/', 'api-reference/doc-tool/payment-api/',
    'api-reference/doc-tool/', 'api-reference/health-ai/medassist/', 'api-reference/health-ai/', 'api-reference/authorization/',
    'api-reference/connect/webhooks/', 'api-reference/connect/', 'api-reference/end-to-end-encryption/',
    'api-reference/datasets/', 'api-reference/knowledge-base/', 'api-reference/', 'ekascribe/api-reference/', 'ekascribe/',
    'integrations/interoperability/', 'integrations/health-ai/', 'integrations/core-emr/', 'integrations/console/',
    'integrations/changelog/', 'integrations/mcp/', 'integrations/', 'user-guides/', 'ai-tools/', 'eka-medai/', 'SDKs/',
    'cookbook/',
], key=len, reverse=True)


def walk_pages(x):
    if isinstance(x, str):
        yield x
    elif isinstance(x, dict):
        if x.get('root'):
            yield x['root']
        for k in ('pages', 'groups', 'menu', 'products'):
            for i in x.get(k, []):
                yield from walk_pages(i)
    elif isinstance(x, list):
        for i in x:
            yield from walk_pages(i)


def is_sdk(page):
    p = page.lower()
    return p.startswith('sdks/') or '/sdks/' in p or '/sdk/' in p or p.split('/')[-1].endswith('-sdk')


def split_root(page):
    for root in CONTENT_ROOTS:
        if page.startswith(root):
            return root, page[len(root):]
    return '', page


def remainder(page):
    return split_root(page)[1]


def plan(d):
    mapping = {}
    for fam in d['navigation']['products']:
        api = fam['product'].endswith(API_SUFFIX)
        for it in fam['menu']:
            name = it['item'][:-len(API_SUFFIX)] if api and it['item'].endswith(API_SUFFIX) else it['item']
            slug = SLUGS[name]
            for page in walk_pages(it):
                if slug is None:  # the All APIs index
                    mapping[page] = 'api-sdk/index'
                    continue
                area = 'api-sdk' if api or is_sdk(page) else 'docs'
                rest = remainder(page)
                if area == 'api-sdk' and is_sdk(page) and not rest.lower().startswith('sdk'):
                    rest = 'sdks/' + rest
                mapping[page] = f'{area}/{slug}/{rest}'.replace('//', '/').lower()
    mapping.update({o: n for o, n in OVERRIDES.items() if o in mapping})
    # Collisions (the same page kept under two roots, such as the Synapse SDK
    # docs under both MedAssist and AI Tools): the copy under the shorter root
    # keeps the path; the others gain their root's last folder.
    seen = {}
    for old, new in mapping.items():
        seen.setdefault(new, []).append(old)
    for new, olds in seen.items():
        if len(olds) > 1:
            olds.sort(key=lambda o: len(split_root(o)[0]))
            for old in olds[1:]:
                label = split_root(old)[0].rstrip('/').split('/')[-1].lower()
                area, slug, rest = new.split('/', 2)
                mapping[old] = f'{area}/{slug}/{label}/{rest}'
    return mapping


def rewrite_text(text, mapping, pattern):
    def repl(m):
        return m.group(1) + mapping[m.group(2)]
    return pattern.sub(repl, text)


def main():
    d = json.load(open(DOCS))
    mapping = plan(d)
    news = list(mapping.values())
    dupes = sorted({n for n in news if news.count(n) > 1})
    missing = [o for o in mapping if not os.path.exists(o + '.mdx')]
    print(f'pages to move: {len(mapping)}; collisions left: {len(dupes)}; missing files: {len(missing)}')
    for o in missing[:10]:
        print('  missing:', o)
    for n in dupes[:10]:
        print('  collision:', n)
    if '--apply' not in sys.argv:
        for o, n in list(mapping.items())[:25]:
            print(f'  {o}  ->  {n}')
        return
    assert not dupes and not missing

    # 1. move files
    for old, new in mapping.items():
        os.makedirs(os.path.dirname(new + '.mdx'), exist_ok=True)
        subprocess.run(['git', 'mv', old + '.mdx', new + '.mdx'], check=True)

    # 2. rewrite references: site links "/old", bare paths "old" in config and scripts
    keys = sorted(mapping, key=len, reverse=True)
    alt = '|'.join(re.escape(k) for k in keys)
    alt_paths = '|'.join(re.escape(k) for k in keys if '/' in k)
    end = r'(?=[)#"\'?\s`>\]]|$)'
    # A site link: "/old" or "https://developer.eka.care/old", starting at a boundary.
    linked = re.compile(r'((?<![\w./-])/|https://developer\.eka\.care/)(' + alt + r')' + end, re.M)
    # A file mention "folder/old.mdx" (full paths only, never a bare file name).
    filepath = re.compile(r'(?<![\w./-])(' + alt_paths + r')\.mdx')
    # A quoted path in code or config: exact, full paths only outside docs.json.
    bare_all = re.compile(r'(["\'])(' + alt + r')(?=["\'])')
    bare_paths = re.compile(r'(["\'])(' + alt_paths + r')(?=["\'])')
    exts = ('.mdx', '.md', '.jsx', '.js', '.json', '.py', '.mjs', '.yaml', '.yml', '.html', '.css')
    skip = ('node_modules', '.git', 'scripts/route-map.json', 'scripts/migrate-routes.py')
    changed = 0
    for base, dirs, files in os.walk('.'):
        dirs[:] = [x for x in dirs if x not in ('node_modules', '.git')]
        for f in files:
            path = os.path.join(base, f)[2:]
            if not f.endswith(exts) or any(path.startswith(s) for s in skip):
                continue
            try:
                src = open(path).read()
            except UnicodeDecodeError:
                continue
            out = linked.sub(lambda m: m.group(1) + mapping[m.group(2)], src)
            out = filepath.sub(lambda m: mapping[m.group(1)] + '.mdx', out)
            if path == DOCS:
                out = bare_all.sub(lambda m: m.group(1) + mapping[m.group(2)], out)
            elif path.endswith(('.json', '.py', '.js', '.mjs', '.jsx')):
                out = bare_paths.sub(lambda m: m.group(1) + mapping[m.group(2)], out)
            if out != src:
                open(path, 'w').write(out)
                changed += 1
    print(f'files with rewritten references: {changed}')

    # 3. redirects from every old URL
    d = json.load(open(DOCS))
    redirects = d.setdefault('redirects', [])
    have = {r['source'] for r in redirects}
    for old, new in mapping.items():
        if '/' + old not in have:
            redirects.append({'source': '/' + old, 'destination': '/' + new, 'permanent': True})
    for src, dst in (('/docs', '/docs/get-started/overview'), ('/api-sdk', '/api-sdk/index')):
        if src not in have:
            redirects.append({'source': src, 'destination': dst, 'permanent': False})
    json.dump(d, open(DOCS, 'w'), indent=2, ensure_ascii=False)
    open(DOCS, 'a').write('\n')
    json.dump(mapping, open('scripts/route-map.json', 'w'), indent=1, sort_keys=True)
    print(f'redirects now: {len(redirects)}')


if __name__ == '__main__':
    main()
