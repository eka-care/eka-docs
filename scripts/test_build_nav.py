"""Tests for scripts/build-nav.py. Run: python3 -m unittest scripts/test_build_nav.py"""
import copy
import importlib.util
import json
import os
import re
import subprocess
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('build_nav', os.path.join(ROOT, 'scripts', 'build-nav.py'))
nav = importlib.util.module_from_spec(spec)
spec.loader.exec_module(nav)

CLINICAL = ['Medical Scribe', 'Medical Document Parsing', 'Clinical MCP']
ABDM = ['HIE-CM', 'NHCX', 'UHI']
# Kept out of the navigation (a hidden product): their pages stay live, and the generated /sitemap lists them.
HIDDEN = 'More from Eka'
MORE = ['Medical Agents', 'Medical Knowledge', 'Understanding Integrations', 'All APIs']
# IPD, Billing and Health Records are sections of Eka EMR; they show as items only before the fold.
RESOURCES = ['Get started', 'Auth', 'Webhooks', 'Encryption', 'Eka EMR', 'IPD', 'Billing', 'Health Records', 'Cookbook',
             'Eka MCP']
NEWSBOARD = ['Eka Labs', 'Under the hood', 'Changelog']
EKA_MCP = ['docs/emr/build-with-ai/mcp-server/introduction'] + [f'docs/emr/build-with-ai/mcp-server/{p}' for p in
                                                                 ('remote-mcp', 'local-mcp', 'supported-tools', 'authentication')]
CLINICAL_MCP = ['docs/datasets/build-with-ai/mcp-server/introduction'] + [
    f'docs/datasets/build-with-ai/mcp-server/{p}' for p in ('quickstart', 'tools', 'authentication')]
RECIPES = ['docs/get-started/cookbook', 'docs/get-started/whats-possible/abdm-enabled-his',
           'docs/get-started/whats-possible/medical-records-from-any-source',
           'docs/get-started/whats-possible/clinically-intelligent-his', 'docs/products/patient-experiences',
           'docs/get-started/whats-possible/mcp-connectors',
           'docs/get-started/whats-possible/appointment-management', 'docs/get-started/whats-possible/patient-management',
           'docs/get-started/whats-possible/medicine-lookup', 'docs/get-started/whats-possible/health-assessment']


def untabbed():
    d = json.load(open(os.path.join(ROOT, 'docs.json')))
    products = copy.deepcopy(d['navigation']['products'])
    nav.untab(products)
    nav.unfold(products)
    return products


def item(products, family, name):
    fam = next(f for f in products if f['product'] == family)
    return next(i for i in fam['menu'] if i['item'] == name)


def docs_families(products):
    return [f for f in products if not nav.is_api_family(f)]


class Regroup(unittest.TestCase):
    def setUp(self):
        self.before = untabbed()
        self.products = copy.deepcopy(self.before)
        nav.regroup(self.products)

    def test_families(self):
        nav.tabify(self.products)
        fams = docs_families(self.products)
        self.assertEqual([f['product'] for f in fams], ['Clinical AI', 'ABDM Connect', 'Resources', 'Newsboard', HIDDEN])
        names = {f['product']: [i['item'] for i in f['menu']] for f in fams}
        self.assertEqual(names['Clinical AI'], CLINICAL)
        self.assertEqual(names['ABDM Connect'], ABDM)
        self.assertEqual(names['Resources'], RESOURCES)
        self.assertEqual(names['Newsboard'], NEWSBOARD)
        self.assertEqual(names[HIDDEN], MORE)
        self.assertEqual([f['product'] for f in fams if f.get('hidden')], [HIDDEN])

    def test_pages_preserved(self):
        # Every page docs.json lists today, tabs included, is listed exactly once afterwards.
        listed = nav.page_multiset(json.load(open(os.path.join(ROOT, 'docs.json')))['navigation'])
        nav.tabify(self.products)
        after = nav.page_multiset(self.products)
        self.assertEqual(sorted(listed - after), [])
        self.assertEqual(sorted(set(after - listed) - nav.allowed_additions()), [])
        self.assertEqual([p for p, n in after.items() if n > 1], [])

    def test_idempotent(self):
        twice = copy.deepcopy(self.products)
        nav.regroup(twice)
        self.assertEqual(json.dumps(twice), json.dumps(self.products))

    def test_research_moved(self):
        research = set(nav.walk_pages(item(self.products, 'Newsboard', 'Eka Labs')))
        self.assertIn('docs/models/spotlight', research)
        parsing = set(nav.walk_pages(item(self.products, 'Clinical AI', 'Medical Document Parsing')))
        self.assertNotIn('docs/models/spotlight', parsing)

    def test_cookbook(self):
        cook = list(nav.walk_pages(item(self.products, 'Resources', 'Cookbook')))
        self.assertEqual(cook, RECIPES)
        elsewhere = [p for f in self.products for i in f['menu'] if i['item'] != 'Cookbook'
                     for p in nav.walk_pages(i) if p in RECIPES]
        self.assertEqual(elsewhere, [])

    def test_tabs(self):
        nav.tabify(self.products)
        tabs = {t['tab'] for f in self.products for i in f['menu'] for t in i.get('tabs', [])}
        self.assertNotIn('Release Notes', tabs)
        self.assertNotIn('Cook Book', tabs)
        self.assertIn('Changelog', [i['item'] for i in next(f for f in self.products if f['product'] == 'Newsboard')['menu']])

    def test_platform_split(self):
        nav.tabify(self.products)
        res = [i['item'] for i in next(f for f in self.products if f['product'] == 'Resources')['menu']]
        self.assertIn('Webhooks', res)
        self.assertNotIn('SDKs', res)

        def api_tab(family, name):
            it = item(self.products, family, name)
            return set(nav.walk_pages(next(t['pages'] for t in it['tabs'] if t['tab'] == nav.API_TAB)))
        self.assertEqual(api_tab('Resources', 'Webhooks'), set(nav.WEBHOOKS))
        emr = api_tab('Resources', 'Eka EMR')
        self.assertFalse(emr & set(nav.WEBHOOKS))
        for p in ('api-sdk/sdks/sdks/web-sdk/getting-started', 'api-sdk/sdks/sdks/backend/ekapython-sdk'):
            self.assertIn(p, emr)
        self.assertIn('api-sdk/sdks/sdks/android/ekascribe', api_tab('Clinical AI', 'Medical Scribe'))
        self.assertIn('api-sdk/sdks/sdks/android/medical-records', api_tab('Resources', 'Health Records'))


EMR_MCP = ['introduction', 'remote-mcp', 'local-mcp', 'supported-tools', 'authentication']
MEDAI_MCP = ['introduction', 'quickstart', 'tools', 'authentication']
MOVES = {**{f'docs/agents/mcp-server/{p}': f'docs/emr/build-with-ai/mcp-server/{p}' for p in EMR_MCP},
         **{f'docs/agents/medai-tools-mcp/{p}': f'docs/datasets/build-with-ai/mcp-server/{p}' for p in MEDAI_MCP},
         'docs/scribe/api-integration': 'docs/scribe/build-with-ai/claude-md',
         'docs/agents/mcp-for-emr': 'docs/emr/build-with-ai/mcp-server/introduction',
         'docs/agents/mcp-for-indian-treatment-protocol-search': 'docs/datasets/build-with-ai/mcp-server/introduction',
         'api-sdk/sdks/sdks/ekacare-mcp': 'docs/datasets/build-with-ai/mcp-server/introduction'}


class BuildWithAI(unittest.TestCase):
    def setUp(self):
        self.docs = json.load(open(os.path.join(ROOT, 'docs.json')))
        self.products = self.docs['navigation']['products']

    def group(self, family, name):
        it = item(self.products, family, name)
        tab = next(t for t in it['tabs'] if t['tab'] == nav.DOCS_TAB)
        found, _ = nav.take_group(tab['pages'], 'Build with AI')
        self.assertIsNotNone(found, f'{name} has no Build with AI group')
        return set(nav.walk_pages(found))

    def test_build_with_ai_groups(self):
        # The clinical MCP server (MedAI Tools) is a Clinical AI item of its own; Medical Knowledge no longer holds it.
        clinical = item(self.products, 'Clinical AI', 'Clinical MCP')
        self.assertEqual([t['tab'] for t in clinical['tabs']], [nav.DOCS_TAB])
        self.assertEqual(list(nav.walk_pages(clinical['tabs'][0]['pages'])), CLINICAL_MCP)
        self.assertFalse(set(CLINICAL_MCP) & set(nav.walk_pages(item(self.products, HIDDEN, 'Medical Knowledge')['tabs'])))
        # The Eka MCP server, the one way in to Eka EMR from the navigation, is a Resources item.
        mcp = item(self.products, 'Resources', 'Eka MCP')
        self.assertEqual([t['tab'] for t in mcp['tabs']], [nav.DOCS_TAB])
        self.assertEqual(list(nav.walk_pages(mcp['tabs'][0]['pages'])), EKA_MCP)
        self.assertFalse(set(EKA_MCP) & set(nav.walk_pages(item(self.products, 'Resources', 'Eka EMR')['tabs'])))
        self.assertIn('docs/scribe/build-with-ai/claude-md', self.group('Clinical AI', 'Medical Scribe'))
        agents = set(nav.walk_pages(item(self.products, HIDDEN, 'Medical Agents')))
        self.assertFalse({p for p in agents if 'mcp-server' in p or 'medai-tools-mcp' in p})

    def test_redirects_cover_moves(self):
        redirects = {r['source']: r for r in self.docs['redirects']}
        for old, new in MOVES.items():
            r = redirects.get('/' + old)
            self.assertIsNotNone(r, old)
            self.assertEqual(r['destination'], '/' + new)
            self.assertTrue(r.get('permanent'))
            self.assertTrue(os.path.exists(os.path.join(ROOT, new + '.mdx')), new)
            self.assertFalse(os.path.exists(os.path.join(ROOT, old + '.mdx')), old)

    def test_old_redirects_rechained(self):
        moved = {'/' + p for p in MOVES}
        stale = [r['source'] for r in self.docs['redirects'] if r['destination'] in moved]
        self.assertEqual(stale, [])

    def test_build_with_ai_overviews(self):
        folders = {('Clinical AI', 'Medical Scribe'): 'scribe', ('Clinical AI', 'Medical Document Parsing'): 'models',
                   (HIDDEN, 'Medical Agents'): 'agents', (HIDDEN, 'Medical Knowledge'): 'datasets',
                   ('ABDM Connect', 'HIE-CM'): 'hie-cm', ('ABDM Connect', 'NHCX'): 'nhcx', ('ABDM Connect', 'UHI'): 'uhi',
                   ('Resources', 'Eka EMR'): 'emr'}
        # IPD, Billing and Health Records are sections of Eka EMR; their Build with AI pages live in its sidebar.
        folders = list(folders.items()) + [(('Resources', 'Eka EMR'), f) for f in ('ipd', 'billing', 'health-records')]
        for (family, name), folder in folders:
            it = item(self.products, family, name)
            tab = next((t for t in it['tabs'] if t['tab'] == nav.DOCS_TAB), None)
            self.assertIsNotNone(tab, f'{name} has no Documentation tab')
            self.assertIn(f'docs/{folder}/build-with-ai', set(nav.walk_pages(tab['pages'])), name)

    def test_integrations_overview(self):
        it = item(self.products, HIDDEN, 'Understanding Integrations')
        self.assertTrue(it['description'].startswith('For teams already on an Eka product'))
        pages = list(nav.walk_pages(it['tabs']))
        self.assertEqual(pages[0], 'docs/integrations/overview')
        self.assertIn('docs/solutions/scribe-and-medical-records', pages)

    def test_example_languages_kept(self):
        self.assertEqual(self.docs['api']['examples']['languages'],
                         ['bash', 'python', 'typescript', 'java', 'csharp', 'ruby'])

    def test_api_index_lists_each_product_once(self):
        index = open(os.path.join(ROOT, 'api-sdk/index.mdx')).read()
        self.assertEqual(index.count('title="Medical Scribe"'), 1)

    def test_eka_emr_opens_on_its_documentation(self):
        # IPD, whose docs were only Build with AI, used to open on its API. As a section of Eka EMR it opens with it.
        emr = item(self.products, 'Resources', 'Eka EMR')
        self.assertEqual(emr['tabs'][0]['tab'], nav.DOCS_TAB)

    def test_no_integrations_family_and_no_scribe_link_item(self):
        self.assertNotIn('Integrations', [f['product'] for f in self.products])
        self.assertEqual([i['item'] for f in self.products for i in f['menu'] if i['item'] == 'Medical Scribe'], ['Medical Scribe'])

    def test_navbar_carries_tools_and_community_icons(self):
        # Hugging Face, GitHub and Discord leave Resources for the navbar, beside the Developer tools hammer.
        links = self.docs['navbar']['links']
        self.assertEqual([(l.get('label'), l['href'], l.get('icon')) for l in links], [
            ('Developer tools', '/developer-tools', 'hammer'),
            ('GitHub', 'https://github.com/eka-care', '/images/icons/github.svg'),
            ('Hugging Face', 'https://huggingface.co/ekacare', '/images/icons/huggingface.svg'),
            ('Discord', 'https://discord.gg/THgd5S22EK', '/images/icons/discord.svg')])
        self.assertFalse([i for f in self.products for i in f['menu'] if 'Hugging Face' in i['item']])

    def test_plain_language_descriptions(self):
        want = {'Medical Scribe': 'Consultations become structured notes that complete the chart',
                'Medical Document Parsing': 'Any medical record, in any format, becomes structured data',
                'Medical Agents': 'A ready-made medical assistant, a kit to build your own agent, and SDKs to embed them'}
        for name, desc in want.items():
            fam = HIDDEN if name == 'Medical Agents' else 'Clinical AI'
            self.assertEqual(item(self.products, fam, name)['description'], desc)


class ProductsGroup(unittest.TestCase):
    """Get started > Solutions shows the landing page's solution families, each page carding that family's menu items."""
    PAGES = {'docs/products/clinical-intelligence': ('Clinical AI', 'Clinical AI'),
             'docs/products/abdm': ('ABDM Connect', 'ABDM Connect'),
             }

    def setUp(self):
        self.docs = json.load(open(os.path.join(ROOT, 'docs.json')))
        self.products = self.docs['navigation']['products']

    def test_products_group_lists_the_three_families(self):
        gs = item(self.products, 'Resources', 'Get started')['tabs'][0]['pages']
        found, _ = nav.take_group(gs, 'Solutions')
        self.assertEqual(list(nav.walk_pages(found)), list(self.PAGES))

    def test_each_page_is_titled_and_carded_like_the_landing(self):
        for page, (title, family) in self.PAGES.items():
            src = open(os.path.join(ROOT, page + '.mdx')).read()
            self.assertEqual(nav.page_meta(page)['title'], title, page)
            fam = next(f for f in self.products if f['product'] == family)
            want = [(i['item'], i['href'].replace('https://developer.eka.care', '') if i.get('href')
                     else '/' + next(nav.walk_pages(i['tabs'][0]['pages']))) for i in fam['menu']]
            cards = re.findall(r'<Card title="([^"]+)"[^>]*href="([^"]+)"', src.split('## How they fit together')[0])
            self.assertEqual(cards, want, page)

    def test_agents_overview_opens_medical_agents(self):
        tab = item(self.products, HIDDEN, 'Medical Agents')['tabs'][0]
        self.assertEqual(next(nav.walk_pages(tab['pages'])), 'docs/products/agents')


class EkaEmrFold(unittest.TestCase):
    def setUp(self):
        d = json.load(open(os.path.join(ROOT, 'docs.json')))
        fams = {f['product']: f for f in d['navigation']['products']}
        self.integ = fams[HIDDEN]
        self.emr = next(i for i in fams['Resources']['menu'] if i['item'] == 'Eka EMR')

    def tab(self, name):
        return next(t['pages'] for t in self.emr['tabs'] if t['tab'] == name)

    def groups(self, pages):
        return [p.get('group') for p in pages if isinstance(p, dict)]

    def test_integrations_lists_three_items(self):
        self.assertEqual([i['item'] for i in self.integ['menu']], ['Medical Agents', 'Medical Knowledge', 'Understanding Integrations', 'All APIs'])
        self.assertTrue(self.integ.get('hidden'))

    def test_eka_emr_documentation_holds_the_three(self):
        self.assertEqual(self.groups(self.tab('Documentation'))[1:], ['IPD', 'Billing', 'Health Records'])

    def test_eka_emr_api_tab_holds_the_three(self):
        self.assertEqual(self.groups(self.tab('APIs & SDKs'))[1:], ['IPD', 'Billing', 'Health Records'])

    def test_eka_emr_changelog_holds_billing_and_health_records(self):
        self.assertEqual(self.groups(self.tab('Changelog')), ['Changelog', 'Billing', 'Health Records'])

    def test_no_page_lost_by_the_fold(self):
        pages = set(nav.walk_pages(self.emr['tabs']))
        for p in ('docs/ipd/build-with-ai', 'docs/billing/changelog', 'docs/health-records/changelog',
                  'api-sdk/health-records/create-overview', 'api-sdk/ipd/configuration/setup/get-ipd-setup-data'):
            self.assertIn(p, pages)

    def test_rebuild_is_stable(self):
        before = open(os.path.join(ROOT, 'docs.json')).read()
        subprocess.run([sys.executable, 'scripts/build-nav.py'], cwd=ROOT, check=True, capture_output=True)
        self.assertEqual(open(os.path.join(ROOT, 'docs.json')).read(), before)


class DevTools(unittest.TestCase):
    def setUp(self):
        self.page = open(os.path.join(ROOT, 'developer-tools.mdx')).read()

    def test_sections_in_order(self):
        heads = [l[3:] for l in self.page.splitlines() if l.startswith('## ')]
        self.assertEqual(heads, ['API reference', 'SDKs', 'MCP servers', 'Webhooks'])

    def test_known_tools_are_listed(self):
        self.assertIn('href="/docs/emr/build-with-ai/mcp-server/introduction"', self.page)
        self.assertIn('href="/docs/datasets/build-with-ai/mcp-server/introduction"', self.page)
        self.assertNotIn('/mcp/introduction"', self.page)

    def test_every_card_points_at_a_page_on_disk(self):
        for href in re.findall(r'href="/([^"#]+)"', self.page):
            self.assertTrue(os.path.exists(os.path.join(ROOT, href + '.mdx')), href)

    def test_no_product_twice_in_a_section(self):
        for section in self.page.split('\n## ')[1:]:
            titles = re.findall(r'title="([^"]+)"', section)
            self.assertEqual(len(titles), len(set(titles)), section.splitlines()[0])

    def test_mcp_cards_name_the_server(self):
        mcp = self.page.split('## MCP servers')[1].split('\n## ')[0]
        self.assertIn('title="Eka MCP Server"', mcp)
        self.assertNotIn('title="Eka EMR"', mcp)

    def test_no_page_calls_it_the_eka_emr_mcp(self):
        named = [p for p in nav.walk_pages(json.load(open(os.path.join(ROOT, 'docs.json')))['navigation'])
                 if os.path.exists(os.path.join(ROOT, p + '.mdx'))
                 and 'Eka EMR MCP' in open(os.path.join(ROOT, p + '.mdx')).read()]
        self.assertEqual(named, [])

    def test_eka_mcp_first_then_abdm_connect(self):
        mcp = self.page.split('## MCP servers')[1].split('\n## ')[0]
        self.assertEqual(re.findall(r'title="([^"]+)"', mcp), ['Eka MCP Server', 'MedAI Tools MCP Server', 'ABDM Connect MCP Server'])
        self.assertIn('href="https://github.com/eka-care/eka-abdm-connect-mcp"', mcp)

    def test_navbar_link(self):
        links = json.load(open(os.path.join(ROOT, 'docs.json')))['navbar']['links']
        self.assertEqual(links[0]['href'], '/developer-tools')

    def test_page_is_stable(self):
        before = self.page
        subprocess.run([sys.executable, 'scripts/build-nav.py'], cwd=ROOT, check=True, capture_output=True)
        self.assertEqual(open(os.path.join(ROOT, 'developer-tools.mdx')).read(), before)


class VisibleOnly(unittest.TestCase):
    def test_tools_and_api_index_list_only_products_in_the_navigation(self):
        for page in ('developer-tools.mdx', 'api-sdk/index.mdx'):
            src = open(os.path.join(ROOT, page)).read()
            for hidden in ('Medical Agents', 'Medical Knowledge'):
                self.assertNotIn(f'title="{hidden}"', src, page)

    def test_the_api_index_is_live_but_out_of_the_navigation(self):
        docs = json.load(open(os.path.join(ROOT, 'docs.json')))
        fams = {f['product']: f for f in docs['navigation']['products']}
        self.assertNotIn('All APIs', [it['item'] for it in fams['Resources']['menu']])
        self.assertIn(nav.API_INDEX, set(nav.walk_pages(fams[HIDDEN])))


class Sitemap(unittest.TestCase):
    def setUp(self):
        self.page = open(os.path.join(ROOT, 'sitemap.mdx')).read()
        self.docs = json.load(open(os.path.join(ROOT, 'docs.json')))

    def test_hidden_from_the_nav_and_search(self):
        self.assertIn('\nhidden: true\n', self.page.split('---')[1])

    def test_lists_every_page_in_the_navigation(self):
        listed = set(re.findall(r'\]\(/([^)#]+)\)', self.page))
        missing = sorted(set(nav.walk_pages(self.docs['navigation'])) - listed)
        self.assertEqual(missing, [])

    def test_hidden_products_are_marked(self):
        self.assertIn('## More from Eka', self.page)
        self.assertIn('Not in the navigation', self.page)


if __name__ == '__main__':
    unittest.main()
