# Technology Migration Engine

A final year student project that transpiles Perl Catalyst MVC controllers into Java Spring MVC controllers using a combination of transpiler and LLM (large language model) techniques.

For deeper background, see the [wiki](wiki/README.md): requirements, supported Perl syntax, and the TDD incident log.

## Prerequisites

Before running anything, make sure you have the following installed at the exact versions listed, later versions may not work:

- Python 3.10.8
- Node.js 20.19.5
- npm 10.8.2
- Visual Studio (with the C++20 workload) (required to compile native Node.js add-ons like `tree-sitter`)

## Commands

### `npm run setup`

Run this once before anything else. It:
1. Installs all npm dependencies (`npm install`)
2. Applies any patches in the `patches/` folder via `patch-package`
3. Builds the native `@ganezdragon/tree-sitter-perl` grammar so the Perl parser works at runtime

You must re-run this if you pull changes that add or modify dependencies.

### `npm run start`

Starts the app in development mode. It runs two processes in parallel:
1. A Vite dev server (React frontend, hot-reload enabled) on `http://localhost:5173`
2. Electron, which waits for the Vite server to be ready before launching the desktop window

Use this while actively developing: changes to the frontend are reflected instantly without a rebuild.

### `npm run build`

Produces a production build. It:
1. Bundles the React frontend with Vite into optimised static assets
2. Packages the entire app into a standalone Windows portable executable using `electron-builder`

The output is placed in the `dist/` folder.

### `npm run test`

Runs the full test suite. There are three scopes available:

1. `npm run test:backend`: Node.js built-in test runner against all files in `src/backend/tests/prod/`
2. `npm run test:frontend`: Playwright end-to-end tests (headless)
3. `npm run test:frontend:ui`: Playwright tests with the interactive UI mode for step-by-step debugging
