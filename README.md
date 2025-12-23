# ax-grid-app — Quickstart

This repository is a small React + TypeScript app bootstrapped with Vite.

## Prerequisites

You must have Node.js installed to use this project. This project was created with Node.js v24.12.0. Some older Node.js versions may cause errors or incompatibilities.

Quick steps to get running locally:

## Install dependencies

To install all dependencies both for the front end app and the backend app run the following command while being in the main folder

```bash
npm run install:all
```

## Run development server (HMR)

To run both frontend and backend servers for development purposes (with hotreload for front) run the following command:

```bash
npm run dev:all
```

And visit <http://localhost:5173> in your browser (Vite will print the exact URL).

## Open the app

To run both frontend and backend servers with the build package. (This will run the build command)

```bash
npm run preview
```

And visit <http://localhost:4173>

Useful scripts

- `npm run install:all` - install all project dependencies
- `npm run dev` — start dev server
- `npm run dev:all` - run frontend and backend dev servers (with hotreload for front)
- `npm run build` — run TypeScript build and Vite production build
- `npm run preview` — preview the production build locally with backend server
- `npm run lint` — run ESLint checks
- `npm test` — run unit/integration tests with Vitest
- `npm run test:ui` — run tests with Vitest UI
- `npm run test:coverage` — run tests with coverage report
- `npm run test:e2e` — run Playwright E2E tests
