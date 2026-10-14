---
description: Run the documentation check and explain every finding with its fix
argument-hint: [product-slug] [--fix]
---

Run the check and make each finding actionable. Load `docs-strategy` for the rules. Arguments: $ARGUMENTS

1. Run `npm run docs:check $ARGUMENTS` from the repo root (install with `npm ci` if `node_modules` is missing). Show the report as printed.
2. For each rule that produced findings, say in one line what the rule protects and what fixes it:
   - `ladder`: a required rung is missing; `/product-new` scaffolds it, or write the page by its skill.
   - `type`: add `type:` to the page's frontmatter; the thirteen types are in `docs-strategy`.
   - `workflow`: the operation or journey named does not exist; fix the spelling, add the operation to the spec, or create the journey.
   - `reference`: the page's operation is not in the spec, or the page carries a hand-written schema; `/api-sync` walks through it.
   - `coverage`: an operation no workflow uses, or no page renders; write the workflow, or `--fix` for the page.
   - `used-in`: run with `--fix`.
   - `quickstart`: the page walks through no workflow; `/quickstart-new` rewrites it around the representative one, or add `workflow: <slug>` if it already does.
   - `errors`: a code on the errors page that no response example in the spec carries; add the example or remove the code.
3. If the product has `enforce: false`, say so and that nothing blocks yet. If the product's failures are zero, say the product is ready to set `enforce: true` in its `product.yaml`.
4. Offer to fix the findings in order of rule, starting with `--fix` for the mechanical ones, and wait for a yes.
