# AGENTS.md — Instructions for Coding Agents

Before changing code:

1. Read `README.md`, `SYSTEM.md`, `docs/PRD.md`, `docs/design-system.md`, and `docs/architecture.md`.
2. Inspect the existing project structure and package versions.
3. Do not assume NativeWind or Expo versions; inspect `package.json` and current configuration.
4. Identify the smallest implementation slice and state assumptions.

## Implementation expectations

- Follow the PRD and design system.
- Reuse existing UI components and design tokens.
- Keep UI, domain logic, and persistence separate.
- Use typed repository/service boundaries.
- Keep local-first behavior working without network access.
- Never introduce a backend, state manager, or abstraction layer unless needed by a real requirement.
- Do not add a new dependency if the current stack already supports the task.

## NativeWind / Tailwind

- Use the installed NativeWind version's documented configuration.
- Keep semantic color names consistent across light and dark themes.
- Avoid arbitrary hex utility classes in feature components.
- Keep dynamic chart colors and non-class styles sourced from theme tokens.
- Verify styling on an actual Android device or emulator; React Native styling is not identical to browser CSS.

## Finance and payroll

- Store IDR amounts as integers.
- Test balance and category aggregation.
- Imported payroll must enter a review state before becoming a confirmed transaction.
- Do not assume every HRIS can be automated.
- Never bypass OTP, CAPTCHA, access controls, or employer policies.
- Never include real payroll data in tests, screenshots, fixtures, or logs. Use synthetic fixtures.

## Quality checks

Run the project's available checks, for example:

- typecheck
- lint
- unit tests
- Expo Android build / emulator smoke test

Use actual package scripts from `package.json`; do not invent commands.

## CI expectations

- CI uses Bun and `bun.lock`; install with `bun install --frozen-lockfile`.
- Before submitting changes, run `bun run lint`, `bun run format:check`, and `bun run typecheck`.
- CI validates the public Expo config, Expo dependency compatibility, and Android export.
- Add unit tests when a test suite is introduced; do not treat an empty test run as coverage.
- Keep GitHub Actions permissions least-privilege, pin third-party actions to immutable commit SHAs, and never add secrets to workflow files.
- Review Expo SDK and React Native compatibility before merging dependency updates.

## Completion response

When finishing a task, report:

- What changed.
- Files created or modified.
- Commands/checks run and their results.
- Known limitations and follow-up work.
- Documentation updated.
