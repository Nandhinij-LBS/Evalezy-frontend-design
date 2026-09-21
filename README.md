# EvalEzy PMS — Mobile Frontend

Mobile-first Performance Management System UI built with React + TypeScript +
Tailwind CSS. Frontend design only, powered by sample data through a mock
`services/api.ts` layer — no real backend required to run it.

## Screens

| Page | Route | Matches Figma frame |
|---|---|---|
| Sign In | `/` | 1st page login (User ID + Password) |
| Goals List | `/goals` | goals-empty-state / goals-in-progress |
| Add Goal | `/goals/add` | Screen 1/2/3: Add Goal (empty, library, prefill) |
| Goal Detail | `/goals/:goalId` | goal-detail / goal-detail-employee-redesign |
| Profile | `/profile` | — |

## Run it in VS Code

1. Open this folder in VS Code.
2. Install dependencies:
```bash
   npm install
```
3. Start the dev server:
```bash
   npm run dev
```
4. Open the printed URL (usually `http://localhost:5173`).

## Try the flow

1. **Sign In** — User ID: `nandhini@gmail.com`, Password: `password123`, tap Sign In. Goes straight to Goals.
2. **Goals** — lists 5 sample goals with a green **Submit** button at the
   bottom, matching the `goals-in-progress` screen. To preview the empty
   state instead, open `src/data/sampleGoals.ts` and set `sampleGoals` to `[]`.
3. **Add Goal** — tap **Browse Goal Library** to pick a template (search +
   select, like the popup), or fill the form manually with Category, Weight
   stepper, Due Date, and 50% Threshold / 100% Target fields.
4. **Goal Detail** — tap any goal card to see the full 50% / 100% / 150%
   breakdown, recent feedback, and a **Submit for Review** flow with its own
   comment screen (matching the `Submit` frame).


