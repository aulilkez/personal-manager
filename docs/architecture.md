# Architecture — Personal Manager

## 1. Overview

Aplikasi menggunakan pendekatan local-first. UI dan domain logic berjalan di perangkat. Backend tidak diwajibkan untuk fungsi inti.

## 2. Suggested stack

- Expo + React Native + TypeScript.
- NativeWind 5 release candidate + Tailwind CSS 4 untuk utility styling.
- Expo Router untuk navigasi jika sesuai kebutuhan.
- SQLite melalui library yang kompatibel dengan Expo SDK.
- SecureStore / Android Keystore-backed storage untuk secret yang memang diperlukan.
- Expo Notifications untuk notifikasi lokal.
- Kotlin native module hanya untuk kebutuhan Android khusus seperti Accessibility Service atau integrasi WorkManager.

## 3. High-level modules

```text
App
├── Dashboard
├── Calendar
├── Tasks
├── Finance
│   ├── Transactions
│   ├── Categories
│   ├── Budgets
│   ├── Reports
│   ├── Payroll Import
│   └── Finance Insights
├── Notes
├── Goals
└── Settings
```

## 4. Suggested folder structure

```text
src/
  app/                  # routes / screens
  components/
    ui/                 # shared primitives
    layout/
  modules/
    dashboard/
    calendar/
    tasks/
    finance/
      components/
      domain/
      repositories/
      services/
      schemas/
    notes/
    goals/
    payroll/
      adapters/
      parsers/
      schemas/
      services/
  database/
    migrations/
    schema/
    client.ts
  theme/
    tokens.ts
    themes.ts
  lib/
  hooks/
  types/
```

Native Android code (if needed):

```text
modules/
  android-automation/
    android/
      src/main/java/...
```

## 5. Data ownership

- SQLite adalah sumber data utama pada MVP.
- Repository layer memisahkan SQL dari UI.
- Domain services menangani perhitungan saldo, durasi lembur, pengulangan event, dan insight.
- UI tidak menulis query SQL langsung.
- Setiap data impor menyimpan `source`, `importedAt`, dan status review.

## 6. Initial domain entities

### Transaction

- id
- type: income | expense
- amount (integer in smallest currency unit, e.g. IDR rupiah)
- categoryId
- title
- occurredAt
- note
- source: manual | payroll_import | other_import
- verificationStatus: draft | confirmed
- createdAt, updatedAt

### CalendarEvent

- id, title, description
- startAt, endAt
- category
- location
- recurrenceRule (nullable)
- reminderMinutes (nullable)
- source (manual | work_schedule | payroll)
- createdAt, updatedAt

### PayrollImport

- id, sourceType: pdf | image | adapter
- periodStart, periodEnd
- grossAmount, netAmount
- deductions and components (structured JSON or normalized child rows)
- extractionStatus
- verificationStatus
- importedAt

Do not store money as floating point. Use integer rupiah for IDR.

## 7. Payroll import flow

1. User selects a PDF or image.
2. Parse text or run OCR locally.
3. Map recognized labels to canonical payroll fields.
4. Validate arithmetic where possible.
5. Show editable review screen.
6. User confirms.
7. Create payroll record and optional income transaction.
8. Record import source and prevent accidental duplicate imports.

Duplicate prevention should use a stable fingerprint from period, employer/source label, net amount, and file hash where available. Do not rely on amount alone.

## 8. HRIS adapter strategy

There is no universal scraper for arbitrary HRIS applications.

Use adapter contracts:

```ts
export interface PayrollSourceAdapter {
  id: string;
  displayName: string;
  canImport(): Promise<boolean>;
  importPayroll(): Promise<PayrollDraft>;
}
```

Adapters should be implemented only for supported and authorized sources. Prefer, in order:

1. Official API/export.
2. User-selected PDF or image import.
3. Supported share/export intent.
4. UI automation only when allowed and technically stable.

Do not bypass OTP, CAPTCHA, app attestation, DRM, authentication controls, or access restrictions. Do not collect another employee's data. Automation must stop and ask the user when manual authentication or consent is needed.

## 9. Scheduling and notifications

- Android background execution is best-effort and subject to OS battery and background restrictions.
- WorkManager can schedule deferrable work; it does not guarantee execution at an exact minute.
- For exact date-10 reminders, schedule a local notification and provide a manual refresh action.
- If the app is not opened or device is off, do not promise an automatic HRIS sync.
- After device reboot, scheduled work should be re-enqueued by native implementation if required.
- Keep payroll sync idempotent.

## 10. Security and privacy

- No passwords in plaintext, logs, analytics, or source code.
- Prefer user-driven login in the HRIS app.
- Store only minimum necessary payroll fields.
- Protect local database and backups according to sensitivity and platform capabilities.
- Do not upload payroll or payslips to an AI provider without explicit, informed consent.
- Redact amounts, names, employee IDs, and payslip contents from crash reports.
- Provide delete/export controls.
