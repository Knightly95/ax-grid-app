# Technical Decisions

## State Management: Zustand

I chose Zustand over Redux or Context API for managing the real-time energy offers data.

**Why Zustand?**

The main requirement is displaying real-time energy trades that update every 10-30 seconds via WebSocket. With this kind of frequent data flow, performance matters. Zustand gives me selective subscriptions, meaning each component only re-renders when the specific piece of state it cares about actually changes. If I'd used Context API, every component would re-render on every single offer update, which would hurt performance as the list grows.

Zustand also keeps things simple—no provider wrappers, minimal boilerplate, and the code stays readable. Since I've worked with it before, I knew I could implement it cleanly without spending time learning a new library during the assessment.

**Trade-offs considered:**

- **Context API**: More "React-native" but would cause unnecessary re-renders with frequent WebSocket updates
- **Redux**: More powerful but overkill for this scope, plus more boilerplate
- **Zustand**: Right balance of simplicity and performance for real-time data

The goal was to show I can pick the right tool for the job—something lightweight that handles real-time updates efficiently without over-engineering.

## Real-time Updates - Socket.io

I chose Socket.io for real-time, bidirectional updates between the frontend and backend.

**Why Socket.io?**

The app requires real-time, bidirectional updates for energy offers and trades. Socket.io provides a robust abstraction over WebSockets, handling reconnection, event-based messaging, and fallback transports automatically. This ensures users always see the latest data with minimal delay, which is critical for a trading interface.

Socket.io was also suggested by the provided template, and it integrates easily with both Node.js backends and React frontends. Its event-driven API keeps the codebase clean and focused on business logic rather than low-level networking.

**Trade-offs considered:**

- **WebSocket (raw):** More control but requires manual reconnection logic and more boilerplate.
- **Socket.io:** Best balance of reliability, developer experience, and real-time performance for this use case.

## Component Library - Material-UI

I chose Material-UI (MUI) as the component library for the UI.

**Why Material-UI?**

Material-UI (MUI) offers a comprehensive set of production-ready React components with built-in accessibility, theming, and responsiveness. This allowed for rapid development of a polished, consistent UI that meets modern standards without building every component from scratch.

MUI's strong documentation and community support also made it easy to resolve issues quickly. The design system ensures a professional look and feel, which is important for a technical assessment and for user trust in a trading platform.

**Trade-offs considered:**

- **Custom components:** More control over look/feel but much slower to build and harder to maintain.
- **MUI:** Slightly larger bundle size, but the time saved and accessibility features outweigh this for the project scope.

The priority was to deliver a visually appealing, accessible UI efficiently.

## Form Configuration - JSON-driven

I chose a JSON-driven approach for form configuration.

**Why JSON-driven forms?**

The app needs to support different energy sources, each with unique form requirements. Using a JSON-driven configuration allows forms to be generated dynamically based on backend data, making the UI flexible and easy to extend for new energy types without code changes.

This approach also aligns with the backend template, which already provides partial form configs. It enables rapid iteration and reduces the risk of frontend-backend mismatch.

The goal was to maximize flexibility and minimize code duplication, accepting some loss of type safety for easier extensibility.

## Form Handling - React-hook-form

I chose React-hook-form for form state management and validation.

**Why React-hook-form?**

React-hook-form provides a performant, flexible way to manage form state, validation, and submission in React. It integrates well with dynamic forms and supports custom validation logic, which is important for the varied requirements of energy offerings.

Having used it successfully in previous projects, I knew it would keep forms performant (minimal re-renders) and code concise. Its API is also compatible with the JSON-driven config approach.

**Trade-offs considered:**

- **Manual state:** More control but much more boilerplate and error-prone.
- **React-hook-form:** Best balance of flexibility, performance, and ease of use for this project.

The aim was to keep forms robust and maintainable, especially as requirements evolve.

## Code Quality - Prettier + ESLint

I chose Prettier and ESLint for code quality and consistency.

**Why Prettier + ESLint?**

Consistent code style and early error detection are essential for maintainability, especially in collaborative or assessment settings. Prettier enforces a uniform code format, while ESLint catches potential bugs and enforces best practices.

Both tools are already widely adopted and easy to integrate into modern React projects. They help keep the codebase clean, readable, and error-free, which is important for both development speed and code review.

The goal was to ensure high code quality with minimal overhead.

## Unit Testing - Vitest

I used Vitest for unit and component testing.

**Why Vitest?**

Vitest is fast, works out of the box with Vite, and has a Jest-like API. This made it easy to write and run tests without extra setup. It also integrates well with React Testing Library for component tests.

**Trade-offs considered:**

- **Jest:** More mature, but slower and less integrated with Vite.
- **Vitest:** Faster and simpler for Vite projects, also already had some experience with it.

The goal was to keep testing fast and frictionless.

## End-to-End Testing - Playwright

I used Playwright for end-to-end (E2E) testing.

**Why Playwright?**

Playwright makes it easy to write reliable browser tests that cover real user flows. It supports multiple browsers and has a good UI for debugging. This helps catch issues that only appear in the full app, not just in unit tests.

**Trade-offs considered:**

- **Cypress:** Also good, but Playwright is faster and supports more browsers.
- **Playwright:** Great for cross-browser testing and debugging, also already had some experience with it.

## Mocked Marketplace Creation

For showcasing purposes, I mocked the creation of energy offerings (the marketplace) using local storage, since there’s no backend for that part. This simulates how the app would react and work if the full REST API were available.

## Future Revisions

If I were to keep working on this app, I would:

- **Check accessibility more thoroughly:** I would review the app to make sure it’s accessible to all users, fixing any issues I missed.
- **Finish workflows like offer editing:** I’d add an offer edit feature (likely as a modal, similar to the details view). Offers would be able to edit the amount of kW acquired, which should be straightforward to implement, i would rely on the REST API for submitting offers, and use Socket.io only for real-time offer updates (receiving the event from the backend api) to keep the UI in sync. I didnt do it because i though that i've done similar things in the app already that should highlight how i would have done it and i wanted to present the assignment before christmas.
- **Add a graph library:** I’d consider adding a graph to show changes or trends, but this would require a more developed backend. If I had to mock it on the frontend, I’d want a meeting to clarify what’s important to visualize, so I don’t graph irrelevant data.
