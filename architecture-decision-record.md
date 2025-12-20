# Architecture Decisions

## ESLint Promise Rules - Targeted Disables

**Context:** TypeScript ESLint's `recommendedTypeChecked` includes `no-floating-promises` and `no-misused-promises` rules that flag unhandled Promises. These rules are valuable for catching real bugs where async errors go unhandled.

**Decision:** Keep rules active globally, but use targeted `eslint-disable` comments for safe React library patterns (React Router's `navigate()` and React Hook Form's `handleSubmit()`).

**Why:**

- These libraries handle errors internally - the returned Promises are intentionally ignored
- This is the documented pattern from both library maintainers
- Disabling rules globally would lose protection against actual bugs in custom async code

**Alternative Considered:**

- Global disable: Would lose error protection everywhere
- `void` operator: Non-standard, confusing, raises questions without adding safety

**Future Consideration:** Keep in mind if the inline disables become too frequent may revisit decision
