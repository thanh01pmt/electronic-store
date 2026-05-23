# AI Agent Guardrails

## ❌ Do NOT
1. Edit platform rule files directly (`.cursor/`, `.windsurfrules`, `.agents/rules/`, `.github/`). They are auto-generated. Edit the source files under `openspec/project.md` and `.ai/` and run `npm run sync:context`.

## ✅ Always
1. Use the OpenSpec workflow for architectural changes.
2. Verify changes with a local production build (`npm run build`) before making PRs.
3. Validate changes with `openspec validate --strict` to ensure no schema regressions.

## 🗃️ On Archiving an OpenSpec Change
After running `openspec archive <change-id> --yes`:
1. **Check `doc/`** for stale content.
2. **Re-sync platform files** — run `npm run sync:context`.
