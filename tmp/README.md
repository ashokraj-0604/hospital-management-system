# Safe cleanup staging area

Use this folder for safe, non-destructive cleanup reviews.

## Two-step cleanup flow

1. Move suspected unused files into `tmp/orphans/` (do not delete yet).
2. Run build, lint, and tests to confirm nothing breaks.
3. Keep moved files in the PR for reviewer verification.
4. Delete the staged files only after approval in a follow-up change.
