# AI Agent Workflow Guide

Welcome! If you are an AI agent picking up a task for this project, you must adhere to the following workflow for maximum efficiency and repository hygiene.

## 1. Ticket Selection
- When prompted by the user to "work on ticket #X", use the GitHub CLI to read the issue:
  ```bash
  gh issue view X
  ```
- If you don't have a specific ticket, list the ready backlog to find your next task:
  ```bash
  gh issue list --label "status: ready" --limit 5
  ```

## 2. Status Updates
- When you begin work, immediately assign the issue to yourself (if possible) and update the label:
  ```bash
  gh issue edit X --add-label "status: in-progress" --remove-label "status: ready"
  ```
- If you encounter blocking dependencies or need user input:
  ```bash
  gh issue edit X --add-label "status: blocked" --remove-label "status: in-progress"
  ```

## 3. Implementation Plan
- Always read the issue's **Acceptance Criteria**.
- Before writing code, use the `implementation_plan` artifact (or similar tool) to propose your architectural changes to the user.
- Await user approval before executing modifying commands.

## 4. Execution & Commits
- If creating git commits on behalf of the user, ensure atomic commits that map directly to the Acceptance Criteria.
- Mention the issue number in the commit message: `feat: add google calendar oauth (fixes #X)`.

## 5. Wrapping Up
- Once all acceptance criteria are met, verify the implementation (e.g. run a build or execute tests).
- When fully complete, transition the label to done, or simply close the issue if a PR isn't required:
  ```bash
  gh issue close X --reason "completed"
  ```
- If opening a PR, use:
  ```bash
  gh issue edit X --add-label "status: review" --remove-label "status: in-progress"
  ```

## Reference
- See `LABELS.md` for the exact definitions of all tags.
- See `BACKLOG.md` for the high-level roadmap.
