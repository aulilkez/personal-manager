# Product Requirements Document — Personal Manager

**Status:** Draft baseline  
**Initial platform:** Android  
**Initial UI language:** Indonesian  
**Data approach:** Local-first

## 1. Vision

Help users manage everyday life—time, work, money, notes, and goals—with a simple, secure, and consistent personal app.

## 2. User problems

- Work schedules, overtime, and personal activities are spread across multiple places.
- Income and expenses are difficult to track consistently.
- Users need a simple overview of their financial situation.
- Payroll information is held in company HRIS systems that do not always provide an API.
- Productivity apps often feel too complex for everyday needs.

## 3. Target users

Individuals who want to manage their activities, work schedules, personal finances, and goals without having to use multiple apps.

## 4. Experience principles

- The dashboard provides a quick overview rather than displaying every detail.
- Each module can be used independently.
- Entering transactions and events should be quick.
- Sensitive data remains local by default.
- AI provides explainable suggestions; it does not perform financial transactions.
- Sync status and data sources are visible.

## 5. MVP scope

### 5.1 Dashboard

- Greeting and today's date.
- Summary of completed tasks, agenda, balance, and goal progress.
- Today's agenda.
- Quick access to modules.
- A streak or consistency widget that can be disabled.

### 5.2 Calendar

- Month, Week, and Day views.
- Create, edit, delete, and move events.
- Title, date, start/end time, location, category, notes, and reminders.
- Recurring events.
- Initial categories: Work, Overtime, Personal, Learning, and Other.
- Work schedules and overtime are recorded as separate events.
- Work/overtime duration summaries are calculated from valid events; prevent double-counting overlapping events.

### 5.3 Tasks

- Create and edit tasks.
- Statuses: not started, in progress, completed, canceled.
- Priority, due date, reminders, and recurrence.
- Filters for today, upcoming, and completed tasks.

### 5.4 Finance

- Record income and expenses.
- User-manageable categories.
- Calculate balance from transactions; do not edit it directly.
- Monthly and category budgets.
- Period summaries: month, week, year.
- Transaction history, search, filters, and export.
- Imported transactions include a source and verification status.
- Payroll can be recorded as income after the user reviews the import results.

### 5.5 AI Finance Agent

- Read local transaction summaries selected by the user.
- Detect changes in spending patterns and potential budget overruns.
- Provide recommendations with reasons and comparison periods.
- Flag incomplete data.
- Do not automatically change transactions, budgets, or balances.
- Each recommendation has an action: dismiss, save, or apply after confirmation.

**MVP fallback:** If no AI model is available yet, show locally generated rule-based insights. Do not present an insight as AI-generated when it is actually rule-based.

### 5.6 Notes and Goals

- Text notes with created/updated timestamps and search.
- Goals with an initial value, target value, deadline, and progress.
- Optionally link goals to tasks.

### 5.7 Payroll import

Initial stage:
- Select a PDF or payslip image.
- Extract text or run OCR on-device when possible.
- Show a preview of the extracted fields.
- Allow the user to correct and confirm the results before creating a transaction.
- Save source metadata and import time.

Later stage:
- Add HRIS-specific adapters only after access methods and permissions have been verified.
- Do not assume every HRIS application can be scraped.
- Do not bypass OTP, CAPTCHA, biometrics, app protections, or access controls.

## 6. MVP non-goals

- Universal payroll scraping across all HRIS systems.
- Bank integrations or automatic account access.
- Money transfers or payments.
- Required cloud sync.
- Multi-user or social features.
- AI that takes financial actions without approval.

## 7. User stories and acceptance criteria

### Calendar
- As a user, I can create an event with a date and time.
- A saved event appears on the correct date.
- Recurring events produce occurrences according to their rules and can be edited for one occurrence or the entire series.
- Overtime events are visually distinguishable and their duration is calculated.

### Finance
- As a user, I can record income and expenses.
- A period balance is calculated from the opening balance and transactions.
- Editing or deleting a transaction updates summaries consistently.
- An imported payroll transaction is not created until the user confirms it.

### AI Finance Agent
- Insights show the period and data that support the recommendation.
- If there is not enough data, the app states its limitations.
- No data is changed without an explicit user action.

### Payroll
- An unreadable file produces a clear error message.
- Extracted fields are shown before they are saved.
- The user can change the amount and date.
- Files and extraction results are not sent off-device without consent.

## 8. Success metrics

- Users can create a transaction in a few steps.
- Users can create an event and mark it as overtime.
- The balance summary matches the transaction calculation.
- Payroll imports always include a review step.
- No data is lost during local CRUD operations.

## 9. Delivery priorities

1. Foundation: navigation, theme, database, design tokens.
2. Dashboard and Tasks.
3. Calendar and recurring events.
4. Finance CRUD, categories, budgets, and reports.
5. PDF/image import and review.
6. Rule-based Finance Insights.
7. AI provider integration (optional).
8. Experimental HRIS adapters after legal and technical validation.

## 10. Risks and mitigations

- **HRIS differences:** use a source-specific adapter rather than a universal scraper.
- **HRIS UI changes:** detect failures and ask the user to retry manually.
- **Android background restrictions:** schedules are not guaranteed to run on time; use WorkManager where appropriate and provide manual refresh.
- **OCR errors:** show a preview, confidence, and confirmation step.
- **Privacy:** encrypt/secure storage for secrets, minimize data, and do not log payroll information.
