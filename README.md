# Personal Manager

[![CI](https://github.com/aulilkez/personal-manager/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/aulilkez/personal-manager/actions/workflows/ci.yml)

Personal Manager is an Android personal operating system for managing tasks, calendars, finances, notes, goals, and routines in one place.

## Project status

This documentation establishes the product and design baseline. Implementation will proceed in stages, prioritizing a stable core experience, local storage, and personal data security.

## Product principles

- **Local-first:** primary data is stored on the user's device.
- **Private by default:** financial and payroll data is not sent to external services without explicit consent.
- **Simple, not over-engineered:** build for MVP needs first.
- **User confirmation:** payroll imports, budget changes, and AI actions must be reviewable and approved by the user.
- **Accessible:** text size, contrast, touch targets, and navigation should be comfortable on Android.

## Core features

1. Dashboard: activity, agenda, finance, and goal summaries.
2. Calendar: month/week/day views, events, work schedules, and overtime.
3. Tasks: tasks, priorities, due dates, statuses, and recurrence.
4. Finance: income, expenses, categories, budgets, transactions, and reports.
5. AI Finance Agent: insights and recommendations based on local data, subject to user approval.
6. Notes and Goals: notes, goals, and progress.
7. Payroll import: import PDF payslips or images; automatic HRIS integration is experimental.

## Tech direction

- Expo + React Native + TypeScript
- NativeWind 5 RC + Tailwind CSS 4 for utility styling
- SQLite for local storage
- Kotlin native modules only when Android requirements cannot be met with Expo APIs
- Android WorkManager for scheduled work that requires native execution
- Expo Notifications for local notifications, subject to platform limitations

> Final package versions and configuration must match the selected Expo SDK version. Do not copy NativeWind configuration from another version without checking its documentation.
>
> Tailwind CSS 4 currently requires NativeWind 5, which is a release candidate. Verify the setup on the target Expo SDK and Android device/emulator before relying on it in production.

## Documentation

- [PRD](docs/PRD.md)
- [Design System](docs/design-system.md)
- [Architecture](docs/architecture.md)
- [System Rules](SYSTEM.md)
- [Agent Instructions](AGENTS.md)

## Development

Install dependencies with `bun install`. Husky installs a pre-commit hook that formats and lints staged files.

```sh
bun install --frozen-lockfile
bun run lint
bun run format:check
bun run typecheck
bun run test
```

Run `bun run format` to format the project.

Database schema changes are defined in `src/core/database/schema/`. Generate and bundle Drizzle migrations with `bun run db:generate`; the app applies them transactionally during SQLite initialization and tracks schema versions and checksums locally.

GitHub Actions runs lint, formatting, type checks, Expo config and dependency compatibility checks, and an Android export on pull requests targeting `main` and pushes to `main`. CodeQL and dependency review add security checks. The local Bun test runner is used for focused unit tests.

## MVP principles

Start with manual entry and file imports. Do not make HRIS scraping a prerequisite for using the app. HRIS integrations may only be implemented with permission, through interfaces that are permitted to access, and must stop when additional authentication is required or access protections are encountered.
