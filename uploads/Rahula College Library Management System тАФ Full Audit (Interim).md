# Rahula College Library Management System — Full Audit (Interim)

**Site:** https://rclms.netlify.app/  
**Audit date:** 7 October 2026  
**Status:** Interim checkpoint. Detailed page reviews completed for account flows, Dashboard, Books Catalogue, Categories/DDC, Authors, and Publishers. Earlier direct mock testing also covered setup/sign-in, a title/member, one issue/return cycle, the Zebra ZD230 screen, and a 30,000-record browser-storage probe. Further page reviews are still in progress; see **Not yet audited** below.

## Bottom line

**Do not enter real student/member or circulation data into the current deployment.** The public client code uses browser-local storage for records and user/login data rather than a shared authoritative database. A synthetic 30,000-title payload of about 24.6 MB failed to write to browser `localStorage` with `QuotaExceededError`. The public bundle also exposes serious authentication/setup defects, including hard-coded login paths and a public setup flow that can create a Super Admin. Those are production blockers, not cosmetic problems.

The interface can be redesigned in a clean black-and-white style, but visual changes do not correct authentication, data integrity, permissions, backups, or scale. Fix security and data handling first; then simplify the page-by-page workflows.

## Immediate P0 actions

1. **Remove public hard-coded credentials/bypasses immediately.** The inspected JavaScript contains a seeded administrator credential and hard-coded password bypasses. Treat them as compromised; remove the bypasses and rotate any affected credentials. Do not rely on a hidden UI control to secure access.
2. **Disable public Super Admin setup.** The public Setup flow creates a Super Admin from submitted form values and signs that user in; no pre-auth authorization check was found in the inspected client code. Make bootstrap a one-time, server-protected administrator process.
3. **Replace browser-local authentication and storage before real data use.** User objects include password fields in `localStorage`; books, members, loans, fines, notifications, and other records are also browser-local. Use server-side authentication, password hashing, protected sessions, a shared relational database, server-enforced roles, tested row policies, audit logs, and scheduled backups.
4. **Do not treat the current build as ready for 30,000 books.** In the controlled browser-local probe, 30,000 realistic synthetic title records with two copy objects each serialized to approximately 24.6 MB; the browser rejected the storage write. Use database-backed pagination and search, not a larger browser quota.

## Account flows — Sign-up, Sign-in, Setup, Password Reset

**Observed**
- The public landing card presents **Sign In**, **Register**, and **Setup** at the same level, without saying who may register or whether approval is required.
- Registration lets the visitor choose Student, Teacher, or Staff, but gives no visible eligibility, institutional identity, admission-number, or approval guidance. A password mismatch produced a banner, but empty fields relied on browser-native validation. No password strength guidance was visible; the client bundle used a very short minimum.
- Setup is publicly reachable and asks for administrator name/email/password and library name, without explaining that this is a privileged one-time bootstrap.
- Password reset accepted a synthetic `.invalid` address and immediately displayed “instructions dispatched.” The public bundle showed only a local UI state change; no reset token, email/API delivery, or new-password flow was present.
- The password visibility control appeared blank/unlabelled in the inspected DOM.

**REMOVE / CHANGE**
- Remove the hard-coded sign-in bypasses, seeded public credentials, localStorage password storage, and public ability to create a Super Admin. Treat exposed credentials as compromised.
- Replace the fake reset confirmation with a real single-use, expiring token flow; do not claim that an email was sent unless a delivery service accepts it.
- Change registration to an institution-approved process. Users must not be able to grant themselves trusted roles without verification.
- Replace terse **“Forgot?”** with **“Forgot password?”** and native-only validation with accessible inline messages linked to each field.

**ADD**
- State who may sign in/register, which roles are permitted, whether approval is required, and where to get help.
- Add clear password requirements, an accessible Show/Hide password control, duplicate-account and rate-limit states, pending-approval messaging, and expired-session/error states.
- Add the complete recovery journey: generic privacy-safe confirmation, delivery/retry guidance, expiry handling, set-new-password step, and success redirect.
- Keep authorized first-time setup separate from routine sign-in; explain consequences and provide a protected completion path.

**Priority:** P0 for client authentication, exposed credentials, and public privileged setup; P1 for fake recovery and unverified roles; P2 for copy/accessibility polish.

## Dashboard

**Observed**
- The empty-state Dashboard reported zero books, loans, overdue items, and members; the active-loans area provided multiple ways to start Issue Books.
- Actions are duplicated across global Issue/Return buttons, the hero, the empty state, and Quick Operations. The Dashboard had two H1 headings.
- “Real-time” metrics had no visible last-updated time, refresh action, or loading/error state. With zero loans, the overdue card said all loans were within their period, which overstates what was checked.
- Member terminology varied (“members,” “students & faculty,” “students and teachers”). The printer action exposed the Zebra model name on the Dashboard.

**REMOVE / CHANGE**
- Remove duplicate Issue/Return entry points; keep one primary **Issue a book** and one secondary **Process a return** action.
- Make **Dashboard** the single H1; use lower heading levels for the library banner.
- Replace **“Real-time”** unless freshness can be demonstrated. Change the zero-loan alert to **“No active loans to check for overdue items.”**
- Standardize audience terminology and change the Dashboard’s hardware-specific “Zebra ZD230 Labels” shortcut to plain **Print labels**.

**ADD**
- Add a first-run checklist (add categories, books/copies, members; then circulation) and a distinct no-data state.
- Add visible freshness, refresh, stale-data, and load-error indicators.
- Make metric cards lead to their relevant list; give icon-only controls accessible names, focus states, and status announcements.

**Priority:** P1 for duplicate operations and misleading status; P2 for hierarchy, freshness, and accessibility.

## Books Catalogue and Title/Copy Forms

**Observed**
- The empty page said **“No Books Found”** and described a search/filter mismatch even for a new empty library.
- A required Category (DDC) field had no options when no categories existed, but a mock title could still be saved and later appeared under a silent **General** fallback.
- The field **“Number of Copies to Print”** actually created stock; it did not print labels.
- The title form calls an accession number **Parigahana Ankaya**, while the profile/circulation views label the same value as ISBN/ISBN-13.
- **Edit Metadata** opened a blank create-style form with a new generated ID and create-oriented actions, rather than populating the selected book.
- **Add Physical Copy** immediately created a copy without showing a barcode/shelf/condition form or confirmation.
- A student-role UI exposed catalogue mutation controls (add/edit/delete/add copy). Backend permission enforcement was not tested; treat this as a serious access-control concern until verified.

**REMOVE / CHANGE**
- Fix Edit Metadata to load the selected title and offer **Save changes**; do not show a blank new-book form in edit mode.
- Replace “Number of Copies to Print” with **Number of physical copies to add**; separate stock creation from label printing.
- Rename and separate ISBN, library accession number, and per-copy barcode. Validate uniqueness.
- Do not silently substitute General for a missing required category. Disable save and explain the missing prerequisite.
- Replace one-click Add Physical Copy with a reviewable copy form and require server-side role checks on every mutation.

**ADD**
- Add a first-use path to create a DDC category when none exists; show inline guidance for title/copy prerequisites.
- Add copy-level fields/actions for barcode, shelf, condition, status and history, with duplicate checks and an undo/cancel path where safe.
- Add inline validation and unsaved-change warnings; preserve entered data after errors.
- Keep title metadata separate from the physical-copy inventory table.

**Priority:** P1 for role controls, broken edit, immediate copy creation, and category fallback; P2 for terms/empty-state polish.

## Categories & DDC

**Observed**
- The zero state showed “No categories created yet” with two create buttons. DDC code was optional free text without a visible format rule; a plausible shelf location was prefilled.
- Searching for a non-match reused “No categories created yet,” even while the count showed one category.
- A category’s **Browse** action opened Books Catalog but did not preselect/pass through the category filter.
- A populated card exposed only Browse; no edit/archive/delete action was visible.

**REMOVE / CHANGE**
- Distinguish truly empty from filtered-no-results states; do not say there are no categories when the search simply matches none.
- Fix Browse to preserve the category context or label the action as opening the general catalogue.
- Remove the plausible shelf-location default or label it explicitly as an example.
- Define whether DDC is required and which formats are accepted; do not accept arbitrary values silently.

**ADD**
- Add clear edit/archive controls with dependency checks and an audit trail.
- Add DDC examples, duplicate-code checks, count/result clearing, sorting, and a category-management route from the catalogue empty state.

**Priority:** P1 for misleading filtered state, lost context and missing management controls; P2 for classification validation.

## Authors

**Observed**
- The count label **“Registered Figures”** and copy such as “Catalog biographical details” are unclear for a librarian workflow.
- A synthetic author with zero linked books showed **“8 Titles in Library”**; View Titles opened an empty catalogue. This is a confirmed count/data-integrity mismatch in the tested browser-local app.
- A no-match author search left a blank result area with no clear-search action.
- The inspected add modal lacked programmatic dialog naming/role and labels were not associated with their controls in the DOM.
- Populated cards showed View Titles but no visible Edit/Delete or explanation that the directory is read-only.

**REMOVE / CHANGE**
- Fix title counts to use the same source/query as the catalogue; never show a count inconsistent with the linked books.
- Replace “Registered Figures” with plain pluralized **authors** and task-oriented copy.
- Replace the blank search result with a no-match message and clear-search control.
- Add semantic dialog/label associations and keyboard focus management.

**ADD**
- Add a first-author empty state, visible result count, duplicate-name checks, and clear field guidance.
- Add authorized edit/archive controls (or explicitly state read-only behavior) and show **0 linked titles** instead of an empty/contradictory View Titles action.

**Priority:** P1 for false title count and modal accessibility; P2 for search, management and wording.

## Publishers

**Observed**
- Empty and no-match publisher views were blank; the UI said **“0 Registered Houses.”**
- The form prefilled Colombo and `+94 11` without saying whether they were examples or real defaults; validation was browser-native.
- A newly entered synthetic contact was automatically labeled **“Verified Supplier”** without a visible verification process.
- The card exposed Catalog but no edit/delete/archive; Catalog opened an unfiltered general catalogue with no publisher context.

**REMOVE / CHANGE**
- Remove “Verified Supplier” unless verification is an actual permissioned workflow; otherwise mark new records **Unverified** and record who/when verified.
- Remove unexplained real-looking city/phone defaults; use blank fields or clearly marked examples.
- Replace “Registered Houses” with **publishers** and provide specific empty/no-match states.
- Make Catalog preserve the publisher filter or clearly say it opens the full catalogue.

**ADD**
- Add edit/archive controls with permission/dependency warnings and duplicate name/city checks.
- Add result count/clear-search and a linked-title summary; define supplier lifecycle/verification fields if procurement workflows require them.
- Use inline, accessible validation with phone/email guidance.

**Priority:** P1 for misleading verification and missing correction/context paths; P2 for empty states and data entry.

## Previously verified issues outside the six detailed page reviews

- **Local storage and scale:** Browser-local records/login are not a shared library database. The 30,000-title / ~24.6 MB mock storage write failed with `QuotaExceededError`; the temporary test key was removed. This is not a server load test.
- **Issue/return:** One synthetic copy was successfully issued and returned; active loans went from one to zero and slips appeared. After sign-out/sign-in, the Returns Desk still displayed the already-returned transaction and an enabled Confirm Check-In button despite zero active loans. The stale action was not clicked.
- **Zebra ZD230 Label Studio:** Technical jargon and four competing print actions make it feel like an engineering console. The page mixes 96 mm and 98 mm. Three 30 mm stickers + two 2 mm gaps + two 2 mm margins total 98 mm, while `^PW768` is described as 96 mm at 8 dots/mm. Actual media/printer compatibility is unverified; no connection or print action was performed.
- **Monochrome direction:** Use a calm white canvas, black typography/actions, restrained neutral borders, generous spacing, and plain-language labels. Remove gradients, saturated accents, redundant badges and technical hero copy. Keep contrast, keyboard focus, error states, and accessible text labels; do not use color alone for status. The printer page should become a guided “Choose books → verify printer/stock → preview → print” flow, with ZPL/ports under Advanced settings.

## Not yet audited in this page-by-page pass

The detailed audit is still to cover **Stock Audit, the printer screen as a dedicated page review, Issue Books, Returns Desk, Reservations, Fines Ledger, Members Directory, Analytics & Reports, Access Control, and Settings**. Existing earlier spot checks are noted above, but they are not a substitute for those full page reviews. Also not verified: real backend/auth behavior, production role enforcement, actual printer hardware/media output, import/export, backups/restores, concurrency, screen-reader behavior, and production load performance.

## Fix order

1. Remove exposed seed/bypass authentication and close public Super Admin setup.
2. Move auth/data from browser storage to a shared, secured backend; enforce roles and test database policies.
3. Correct catalogue identifiers, title/copy separation, broken edit and unsafe one-click copy creation.
4. Correct false counts and workflow context; add trustworthy validation/empty/error states.
5. Fix circulation transaction safety; verify the stale-return defect is blocked server-side.
6. Run import/export, backup/restore, privacy, accessibility, concurrency and 30,000-title load tests.
7. Apply the black-and-white visual redesign and simplify every operational page; calibrate the printer only with verified hardware/media.

**Scope note:** All interactive records used for this audit were synthetic and isolated to test browser profiles. No real library data was entered; no production configuration, source code, deployment, or printer hardware was changed.
