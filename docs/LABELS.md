# GitHub Labels System

This document outlines the standard labeling system used for GitHub Issues in this project. All issues should be labeled with exactly one Type, Priority, Status, and Area.

## Types (`type:*`)
Identifies the nature of the issue.
- `type: feature` - New functionality or enhancement
- `type: bug` - Something is broken or behaving incorrectly
- `type: refactor` - Code cleanup, tech debt, architectural changes
- `type: infra` - CI/CD, tooling, environment configurations

## Priorities (`priority:*`)
Dictates when an issue should be addressed.
- `priority: P0` - Critical blocker. Must be fixed immediately (e.g., prod down, critical bug).
- `priority: P1` - High priority. Required for the next immediate milestone.
- `priority: P2` - Medium priority. Good to have, schedule for upcoming sprints.
- `priority: P3` - Low priority. Backlog item, minor improvements.

## Statuses (`status:*`)
Tracks the lifecycle of an issue.
- `status: backlog` - Ticket is accepted but not yet prioritized for work.
- `status: ready` - Ticket is well-defined and ready to be picked up by a developer or agent.
- `status: in-progress` - Someone is actively working on this.
- `status: blocked` - Work is paused due to dependencies or missing context.
- `status: review` - PR is open and pending review.
- `status: done` - Work is merged and deployed.

## Areas (`area:*`)
Identifies the domain or component the issue affects.
- `area: calendar`
- `area: goals`
- `area: tasks`
- `area: ai-coach`
- `area: journal`
- `area: settings`
- `area: infrastructure`
