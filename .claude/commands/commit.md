---
description: Commit staged/modified changes with a detailed message and push, no AI co-author attribution
---

# Commit and Push

## Steps

1. Run `git status` and `git diff` (and `git diff --staged` if anything is already staged) to see all changes.
2. Lint and test whatever's actually touched, before staging anything (this mirrors
   `npm run check`, the full check suite):
   - Anything formatted by Prettier changed (`*.ts`, `*.tsx`, `*.css`, `*.json`, `*.md`,
     `*.html`...): `npm run format`, then `npm run format:check`.
   - Any `*.ts`/`*.tsx`/`*.mts` changed: `npm run lint`, `npm run typecheck`, then
     `npm test` (Vitest).
   - Any `src/lib/relay/**` or `src/lib/state/**` changed and Docker is available:
     `npm run test:relay` (protocol compliance against a real WeeChat).
   - Any `src/app/**`, `public/**`, `index.html`, `vite.config.mts` or `package.json`
     changed: also `npm run build`.
   - Only `.claude/**` changed: no checks needed.
   - If any check reports an error, fix it and re-run before continuing.
   - Never stage `build/`, `node_modules/`, or `.claude/settings*.json`.
3. If nothing is staged, stage all relevant modified/new files with `git add`.
4. Write a **detailed** commit message:
   - Subject line: concise summary of the change (imperative mood, e.g. "Add", "Fix", "Refactor").
   - Body: explain _what_ changed and _why_, as bullet points if there are multiple distinct changes.
   - Base the message only on the actual diff — do not include conversational back-and-forth, dead ends, or trial-and-error from the session.
5. Create the commit using a HEREDOC so formatting is preserved, e.g.:
   ```bash
   git commit -m "$(cat <<'EOF'
   Short summary of the change

   - Detail one
   - Detail two
   - Why this change was made
   EOF
   )"
   ```
6. **Do not** add any AI attribution — no `🤖 Generated with Claude Code` line, no `Co-Authored-By: Claude` trailer, no mention of Claude/AI anywhere in the message.
7. Push the commit to the current branch's remote (`git push`, or `git push -u origin <branch>` if it has no upstream yet).
8. Confirm success by showing `git log -1` and `git status` after pushing.

## Rules

- Never include Claude/AI co-authorship or attribution in the commit message.
- Always push after committing — don't stop at just the local commit.
- If the push fails (e.g. diverged branch), report the error and ask before force-pushing or rebasing.
- If a change renders message text, nicks or buffer data, make sure it's rendered as React elements, never as HTML (`dangerouslySetInnerHTML`) — this repo has had XSS regressions there.
