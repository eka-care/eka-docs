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

CLINICAL = ['Medical Scribe', 'Medical Document Parsing', 'Medical Agents', 'Medical Knowledge']
ABDM = ['HIE-CM', 'NHCX', 'UHI']
INTEGRATIONS = ['Understanding Integrations', 'Medical Scribe', 'Eka EMR', 'IPD', 'Billing', 'Health Records']
RESOURCES = ['Get started', 'Auth', 'Encryption', 'All APIs', 'Cookbook', 'Research', 'Models on Hugging Face',
             'Datasets on Hugging Face', 'Changelog']
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
        self.assertEqual([f['product'] for f in fams], ['Clinical AI', 'ABDM Connect', 'Integrations', 'Resources'])
        names = {f['product']: [i['item'] for i in f['menu']] for f in fams}
        self.assertEqual(names['Clinical AI'], CLINICAL)
        self.assertEqual(names['ABDM Connect'], ABDM)
        self.assertEqual(names['Integrations'], INTEGRATIONS)
        self.assertEqual(names['Resources'], RESOURCES)

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
        research = set(nav.walk_pages(item(self.products, 'Resources', 'Research')))
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
        self.assertIn('Changelog', [i['item'] for i in next(f for f in self.products if f['product'] == 'Resources')['menu']])

    def test_platform_split(self):
        nav.tabify(self.products)
        res = [i['item'] for i in next(f for f in self.products if f['product'] == 'Resources')['menu']]
        self.assertNotIn('Webhooks', res)
        self.assertNotIn('SDKs', res)

        def api_tab(family, name):
            it = item(self.products, family, name)
            return set(nav.walk_pages(next(t['pages'] for t in it['tabs'] if t['tab'] == nav.API_TAB)))
        emr = api_tab('Integrations', 'Eka EMR')
        for p in ('api-sdk/webhooks/register-webhook', 'docs/webhooks/webhook-signature',
                  'api-sdk/sdks/sdks/backend/webhook-sdk', 'api-sdk/sdks/sdks/web-sdk/getting-started',
                  'api-sdk/sdks/sdks/backend/ekapython-sdk'):
            self.assertIn(p, emr)
        self.assertIn('api-sdk/sdks/sdks/android/ekascribe', api_tab('Clinical AI', 'Medical Scribe'))
        self.assertIn('api-sdk/sdks/sdks/android/medical-records', api_tab('Integrations', 'Health Records'))


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
        self.assertIn('docs/emr/build-with-ai/mcp-server/introduction', self.group('Integrations', 'Eka EMR'))
        self.assertIn('docs/datasets/build-with-ai/mcp-server/introduction', self.group('Clinical AI', 'Medical Knowledge'))
        self.assertIn('docs/scribe/build-with-ai/claude-md', self.group('Clinical AI', 'Medical Scribe'))
        agents = set(nav.walk_pages(item(self.products, 'Clinical AI', 'Medical Agents')))
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
                   ('Clinical AI', 'Medical Agents'): 'agents', ('Clinical AI', 'Medical Knowledge'): 'datasets',
                   ('ABDM Connect', 'HIE-CM'): 'hie-cm', ('ABDM Connect', 'NHCX'): 'nhcx', ('ABDM Connect', 'UHI'): 'uhi',
                   ('Integrations', 'Eka EMR'): 'emr', ('Integrations', 'IPD'): 'ipd',
                   ('Integrations', 'Billing'): 'billing', ('Integrations', 'Health Records'): 'health-records'}
        for (family, name), folder in folders.items():
            it = item(self.products, family, name)
            tab = next((t for t in it['tabs'] if t['tab'] == nav.DOCS_TAB), None)
            self.assertIsNotNone(tab, f'{name} has no Documentation tab')
            self.assertIn(f'docs/{folder}/build-with-ai', set(nav.walk_pages(tab['pages'])), name)

    def test_integrations_overview(self):
        fam = next(f for f in self.products if f['product'] == 'Integrations')
        first = fam['menu'][0]
        self.assertEqual(first['item'], 'Understanding Integrations')
        self.assertTrue(first['description'].startswith('For teams already on an Eka product'))
        self.assertEqual(list(nav.walk_pages(first)), ['docs/integrations/overview'])

    def test_example_languages_kept(self):
        self.assertEqual(self.docs['api']['examples']['languages'],
                         ['bash', 'python', 'typescript', 'java', 'csharp', 'ruby'])

    def test_api_index_lists_each_product_once(self):
        index = open(os.path.join(ROOT, 'api-sdk/index.mdx')).read()
        self.assertEqual(index.count('title="Medical Scribe"'), 1)

    def test_a_product_opens_on_its_api_when_its_docs_are_only_build_with_ai(self):
        ipd = item(self.products, 'Integrations', 'IPD')
        self.assertEqual(ipd['tabs'][0]['tab'], nav.API_TAB)

    def test_scribe_in_integrations_opens_how_it_works(self):
        it = item(self.products, 'Integrations', 'Medical Scribe')
        self.assertEqual(it.get('href'), 'https://developer.eka.care/docs/scribe/overview#how-it-works')
        self.assertNotIn('tabs', it)

    def test_hugging_face_links_in_resources(self):
        self.assertEqual(item(self.products, 'Resources', 'Models on Hugging Face')['href'],
                         'https://huggingface.co/collections/ekacare/ekacare-public-healthcare-llms')
        self.assertEqual(item(self.products, 'Resources', 'Datasets on Hugging Face')['href'],
                         'https://huggingface.co/collections/ekacare/ekacare-medical-public-datasets')

    def test_plain_language_descriptions(self):
        want = {'Medical Scribe': 'Consultations become structured notes that complete the chart',
                'Medical Document Parsing': 'Any medical record, in any format, becomes structured data',
                'Medical Agents': 'A ready-made medical assistant, a kit to build your own agent, and SDKs to embed them'}
        for name, desc in want.items():
            self.assertEqual(item(self.products, 'Clinical AI', name)['description'], desc)


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
        self.assertIn('title="MedAI Tools MCP Server"', mcp)
        self.assertNotIn('title="Eka EMR"', mcp)

    def test_no_page_calls_it_the_eka_emr_mcp(self):
        named = [p for p in nav.walk_pages(json.load(open(os.path.join(ROOT, 'docs.json')))['navigation'])
                 if os.path.exists(os.path.join(ROOT, p + '.mdx'))
                 and 'Eka EMR MCP' in open(os.path.join(ROOT, p + '.mdx')).read()]
        self.assertEqual(named, [])

    def test_abdm_connect_mcp_is_listed_between_medai_and_eka(self):
        mcp = self.page.split('## MCP servers')[1].split('\n## ')[0]
        self.assertEqual(re.findall(r'title="([^"]+)"', mcp),
                         ['MedAI Tools MCP Server', 'ABDM Connect MCP Server', 'Eka MCP Server'])
        self.assertIn('href="https://github.com/eka-care/eka-abdm-connect-mcp"', mcp)

    def test_navbar_link(self):
        links = json.load(open(os.path.join(ROOT, 'docs.json')))['navbar']['links']
        self.assertEqual(links[0], {'label': 'Developer tools', 'href': '/developer-tools'})

    def test_page_is_stable(self):
        before = self.page
        subprocess.run([sys.executable, 'scripts/build-nav.py'], cwd=ROOT, check=True, capture_output=True)
        self.assertEqual(open(os.path.join(ROOT, 'developer-tools.mdx')).read(), before)


if __name__ == '__main__':
    unittest.main()
