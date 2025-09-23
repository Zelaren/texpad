# Repository Guidelines

## Project Structure & Module Organization
The application lives under `src/`, separated into React components, custom hooks, utilities, shared types, and static assets. Core UI files such as `MainContent.tsx`, `InlineToolbar.tsx`, and `G2ChartComponent.tsx` sit in `src/components`, while editor behavior is isolated in `hooks/useQuillEditor.ts` and layout helpers in `hooks/useLineAlignment.ts`. Quill chart support stays in `utils/ChartBlot.tsx` with contracts in `types/chart.ts`, keeping rendering code and data models aligned.

## Build, Test, and Development Commands
- `npm run dev` — launches the Vite dev server for rapid feedback on rich-text and chart editing flows.
- `npm run lint` — runs ESLint with repository presets to enforce strict TypeScript rules and React Hooks safety checks.
- `npm run build` — executes `tsc -b` then `vite build`, validating type safety before producing the production bundle.
- `npm run preview` — serves the built assets locally so contributors can validate Quill embeds and G2 rendering in a production shell.

## Coding Style & Naming Conventions
TypeScript runs in strict mode and ESLint is mandatory before merging; keep imports ordered as React, third-party packages, then local modules. Components and files should use PascalCase, utilities use camelCase, and custom hooks start with `use`. Tailwind CSS utility classes are preferred for styling, and UI copy stays in Chinese to match product messaging.

## Testing Guidelines
There is no dedicated automated harness yet, so every change must at minimum pass `npm run lint` and `npm run build`. When logic becomes complex, introduce Vitest suites alongside the source file (e.g., `components/__tests__/G2ChartComponent.test.tsx`) to document editor and chart expectations.

## Commit & Pull Request Guidelines
Recent commits follow Chinese prefixes such as “新增/修复/重构：描述”; continue that format with focused summaries (e.g., `修复：优化图表组件和工具栏交互体验`). Pull requests should state the problem, include screenshots or recordings for UI updates, confirm lint/build status, and mention any Quill blot or chart-side effects. Cross-module changes should call out review tips or migration steps in the description.

## Configuration & Security Tips
Keep OpenAI and other third-party credentials in a local `.env` file with `VITE_` prefixes as required by Vite; never commit secrets. Reference relative paths (for example, `src/components/MainContent.tsx`) in walkthroughs so reviewers can follow changes quickly.
