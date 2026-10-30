---
description: Add a dated entry to a product's changelog from a short description
argument-hint: <product-slug> <what changed, one line>
---

Add one changelog entry. Load `writing-style`. Arguments: $ARGUMENTS

1. Find the product's changelog page (`type: changelog`; for products not yet on the ladder, the file named in `product.yaml` or the existing `*-changelog.mdx` at the repo root). Read its last three entries to match the format in use.
2. Write the entry in the page's existing format, dated today, newest first. The entry says what changed for an integrator and what, if anything, they must do: "The `verify` response can now return `skip_state` `confirm_mobile_otp`. Handle it before calling `create-phr`." Link the page that documents the change. No internal ticket ids, no author names.
3. If the change touched a workflow's call order, a field a workflow persists, or an error code, say which page you updated alongside, or flag that it still needs updating.
4. Show the entry and the diff; do not commit.
