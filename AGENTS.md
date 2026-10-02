# Repository instructions

## Supported languages

- The site supports exactly two languages: Ukrainian (`uk`) and English (`en`).
- Create or update all user-facing content in both supported languages in the same change unless the user explicitly requests otherwise.
- Blog posts must have matching `posts/<slug>-uk.md` and `posts/<slug>-en.md` files with synchronized dates, equivalent meaning, and valid localized titles and links.
- Do not publish a new post in only one language. If source material is supplied in one language, prepare the other supported-language version as part of the same task.
- When editing an existing localized page or post, keep its paired translation aligned with every material content change.

## Branch synchronization before push

- Before every push, fetch both `origin/main` and the current branch's remote upstream, then compare the current branch with each of them.
- If the remote upstream moved, merge it into the local branch first. Never overwrite another contributor's remote changes with a force-push.
- If the branch is behind `origin/main`, merge `origin/main` into the current branch unless the user explicitly requests a rebase. Do not rewrite published branch history or force-push by default.
- After a merge or conflict resolution, rerun the relevant tests, type checks, and production build before pushing.
- Immediately before the final push, fetch and compare both refs again. Push only when the branch is behind neither its upstream nor `origin/main`; if either moved during validation, repeat the merge and validation cycle.
