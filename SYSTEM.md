# SYSTEM — Project-wide Rules

## Product rules

- Build Personal Manager as a local-first personal productivity and finance app.
- Prioritize correctness, privacy, and usability over feature count.
- Do not over-engineer. Implement the smallest complete slice.
- Do not add a server dependency for features that can work locally.
- Keep payroll import optional; core finance must work without HRIS integration.

## Design rules

- Follow `docs/design-system.md`.
- Use semantic design tokens; do not scatter hard-coded hex values through components.
- Zinc is the base palette. Use semantic accents sparingly.
- Default card radius is 8px; avoid excessively rounded cards.
- Keep spacing, typography, borders, and interaction states consistent.
- Use the existing component library before creating a duplicate component.

## Architecture rules

- UI must not contain database queries.
- Use repositories for persistence and domain services for business logic.
- Keep modules independent and expose typed interfaces.
- Use integer values for IDR money; never use floating-point arithmetic for currency.
- Validate imported data before persistence.
- Make import and sync operations idempotent.

## Security rules

- Never commit secrets, tokens, passwords, payslips, or personal payroll samples.
- Never log sensitive financial or payroll values.
- Ask for user confirmation before creating a transaction from imported payroll.
- Never bypass HRIS authentication or security controls.
- Treat OCR and automation output as untrusted until reviewed.

## Engineering rules

- TypeScript strict mode.
- Prefer small components and explicit types.
- Handle loading, empty, error, and success states.
- Add tests for calculations, date boundaries, recurrence, and import normalization.
- Update docs when behavior, architecture, or commands change.
- Avoid unrelated refactors.

## CI and dependency security

- Use the repository's Bun lockfile and frozen installs in CI.
- Grant GitHub Actions only the permissions each workflow needs.
- Pin third-party actions to immutable commit SHAs.
- Never expose secrets to untrusted pull request code or commit credentials.
- Review Expo SDK and React Native compatibility before merging dependency updates.
