---
name: Agent Task
about: Use this template for hyper-granular, AI agent-ready tasks.
title: "task: "
labels: ["status: ready"]
assignees: ''
---

## 🎯 Objective
[Clear, one-line declaration of the feature/change]

## 📁 Source Files
- `path/to/target_file.ts` -> [Short note on what happens here]
- `path/to/reference_file.ts` -> [Use this pattern / schema reference]

## 🛠️ Step-by-Step Logic
1. **Schema/Store:** [e.g., Add `eventId` UUID to the drizzle schema and export the type]
2. **API Route:** [e.g., Create POST /api/events handling payload validations matching reference_file]
3. **Zustand State:** [e.g., Implement addEvent action pushing directly to the local array on 200 OK]

## 🤖 Green-Light Verification
Run these exact commands. If any fail, roll back or fix it before committing:
- Check Types: `npm run typecheck` or `bun pm check`
- Test: [e.g., `npm run test:api` or delete line if no tests exist]
