**High-Level Workflow:**

1. (Create and) assign task in [Zer0 board](https://zer0.io/a/network/tasks/board/3ac44844-2b98-46e1-b29d-7886da72484f) to self
2. Branch from develop (or another feature branch) if work/feature, from master if hotfix
3. Name the branch the type of work followed by the task’s universally unique identifier and a friendly name describing the task; examples:
    *  ```hotfix/0c1a-fixCacheConfig ```
    *  ```feature/b175-stakingPage ```
    *  ```work/Joshua-Jack/b62b-reworkRoutes ```
4. Create (a) failing test(s) (if feature/work/hotfix is testable) that verifies that the feature/work/hotfix has not been implemented yet
5. Perform work on branch in small commits, pushing after each commit
6. Merge parent branch back into branch to ensure it is up to date, resolve merge conflicts as needed
7. Create a draft pull request from the parent branch so that active work is easily visible
8. Ensure test(s) are now passing
9. Once work is completed, mark pull request as ready for review: add relevant reviewers
10. Once pull request is approved, squash and merge into parent branch, create pull request from master to develop and merge if hotfix
11. Mark task in [Zer0 board](https://zer0.io/a/network/tasks/board/3ac44844-2b98-46e1-b29d-7886da72484f) complete and delete branch

**Branches Naming Guidelines:**
* ```master```: code that is in production
* ```develop```: code that may be ahead of master but is always stable & verified; may be merged to master at any time depending on deployment schedules
* ```hotfix/{firstFourTaskUuid}-{friendlyName}```: priority bug fix code that must get to production ASAP; branched from master; merged into master and then back into develop after deployment
* ```feature/{firstFourTaskUuid}-{friendlyName}```: long term and may take a while to get merged; branched from develop and merged back into develop after being verified
* ```work/{githubUsername}/[{optionalFirstFourTaskUuid}-]{friendlyTaskName}```: short term and should not take a while to be merged; branched from develop or a feature branch and merged after being verified