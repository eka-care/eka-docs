"""Tests for scripts/build-nav.py. Run: python3 -m unittest scripts/test_build_nav.py"""
import copy
import importlib.util
import json
import os
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('build_nav', os.path.join(ROOT, 'scripts', 'build-nav.py'))
nav = importlib.util.module_from_spec(spec)
spec.loader.exec_module(nav)

SOLUTIONS = ['Scribe', 'Document Parsing', 'Agents', 'Medical Knowledge', 'ABDM Connect', 'NHCX', 'UHI']
INTEGRATIONS = ['Eka EMR', 'IPD', 'Billing', 'Health Records']
RESOURCES = ['Get started', 'Auth', 'Encryption', 'All APIs', 'Cookbook', 'Research', 'Changelog']
RECIPES = ['docs/get-started/cookbook', 'docs/products/patient-experiences',
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
        self.assertEqual([f['product'] for f in fams], ['Solutions', 'Integrations', 'Resources'])
        names = {f['product']: [i['item'] for i in f['menu']] for f in fams}
        self.assertEqual(names['Solutions'], SOLUTIONS)
        self.assertEqual(names['Integrations'][-4:], INTEGRATIONS)
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
        parsing = set(nav.walk_pages(item(self.products, 'Solutions', 'Document Parsing')))
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
        self.assertIn('api-sdk/sdks/sdks/android/ekascribe', api_tab('Solutions', 'Scribe'))
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
        self.assertIn('docs/datasets/build-with-ai/mcp-server/introduction', self.group('Solutions', 'Medical Knowledge'))
        self.assertIn('docs/scribe/build-with-ai/claude-md', self.group('Solutions', 'Scribe'))
        agents = set(nav.walk_pages(item(self.products, 'Solutions', 'Agents')))
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
        folders = {('Solutions', 'Scribe'): 'scribe', ('Solutions', 'Document Parsing'): 'models',
                   ('Solutions', 'Agents'): 'agents', ('Solutions', 'Medical Knowledge'): 'datasets',
                   ('Solutions', 'ABDM Connect'): 'hie-cm', ('Solutions', 'NHCX'): 'nhcx', ('Solutions', 'UHI'): 'uhi',
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
        self.assertEqual(first['item'], 'Overview')
        self.assertEqual(list(nav.walk_pages(first)), ['docs/integrations/overview'])

    def test_example_languages_kept(self):
        self.assertEqual(self.docs['api']['examples']['languages'],
                         ['bash', 'python', 'typescript', 'java', 'csharp', 'ruby'])


if __name__ == '__main__':
    unittest.main()
