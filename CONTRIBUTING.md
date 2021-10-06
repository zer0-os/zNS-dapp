**High-Level Workflow:**

1. Assign task in [Zer0 board](https://zer0.io/a/network/tasks/board/3ac44844-2b98-46e1-b29d-7886da72484f) to self
2. Branch from develop (or another feature branch) if work/feature, from master if urgent hotfix
3. Name the branch the type of work followed by your git name, followed by a ufriendly name describing the task
   - `hotfix/colbr/fix-domain-minting `
   - `feature/colbr/minting-3d-nfts `
   - `tweak/colbr/mint-modal-styling `
4. Create (a) failing test(s) (if feature/work/hotfix is testable) that verifies that the feature/work/hotfix has not been implemented yet
5. Perform work on branch in small commits, pushing after each commit
6. Merge parent branch back into branch to ensure it is up to date, resolve merge conflicts as needed
7. Ensure test(s) are now passing
8. Once work is completed, mark pull request as ready for review: add relevant reviewers
9. Once pull request is approved, squash and merge into parent branch, create pull request from master to develop and merge if hotfix
10. Mark task in [Zer0 board](https://zer0.io/a/network/tasks/board/3ac44844-2b98-46e1-b29d-7886da72484f) complete and delete branch

**Branches Naming Guidelines:**

- `master`: code that is in production
- `develop`: code that may be ahead of master but is always stable & verified; may be merged to master at any time depending on deployment schedules
- `hotfix/{git-username}/{friendly-task-name}`: priority bug fix code that must get to production ASAP; branched from master; merged into master and then back into develop after deployment
- `feature/{git-username}/{friendly task name}`: long term and may take a while to get merged; branched from develop and merged back into develop after being verified
- `work/{git-username}/{friendly-task-name}`: short term and should not take a while to be merged; branched from develop or a feature branch and merged after being verified
