# Contributing

**Note: Notion tasks will be remaining private to the dApp team for the time being.**

## High-Level Workflow

1. Assign task in Notion to yourself
2. Branch from develop (or another feature branch) if work/feature, from master if urgent hotfix
3. Name the branch per [Branch Naming Guidelines](#branch-naming-guidelines)
4. Perform work on branch in small commits
5. Rebase onto parent branch to ensure it is up to date, resolve conflicts as needed
6. Once work is completed, create a pull request per [PR Naming Guidelines](#pr-naming-guidelines), move the Notion card to "Code Review", and tag relevant reviewers
7. Once the pull request is approved, squash and merge into the parent branch. Create pull request from master to develop and merge if hotfix
8. Move Notion task to "Complete" and delete your branch

## Branch Naming Guidelines

- `master`: code that is in production
- `develop`: code that may be ahead of master but is always stable & verified; may be merged to master at any time depending on deployment schedules

Follow [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/) for all branch titles, for example:

- `{conventional-commit-type}/{git-username}/{friendly-task-name}`
- `hotfix/{git-username}/{friendly-task-name}`: priority bug fix code that must get to production ASAP; branched from master; merged into master and then back into develop after deployment
- `feature/{git-username}/{friendly task name}`: long term and may take a while to get merged; branched from develop and merged back into develop after being verified
- `work/{git-username}/{friendly-task-name}`: short term and should not take a while to be merged; branched from develop or a feature branch and merged after being verified

## PR Naming Guidelines

Follow [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/) for all PR titles, for example:

- `feat(domain-table): buy now button`
- `fix(domain-table): buy now button not opening modal`
- `refactor(domain-table): reduce code smell`
- `docs: updated CODEOWNERS`
- `chore: update zNS-SDK version`
