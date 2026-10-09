# Rahula College LMS — Public-Site Audit

**Site checked:** https://rclms.netlify.app/  
**Audit date:** 7 October 2026  
**Scope:** Public entry page, deployed HTML/assets and JavaScript bundle; setup and core catalogue/member/issue/return flows were exercised using explicitly synthetic test data in an isolated browser profile. I also inspected the Zebra ZD230 Label Studio screen. No real records were entered, no production data was changed, and no physical printer or print command was used.

## Executive summary

The public login screen renders and the home request returns HTTP 200. A synthetic same-browser setup/login and one-book circulation cycle worked, but this does not establish multi-user reliability. The deployed bundle exposes a **critical architectural blocker** for a real school library: books, members, circulation, fines, inventory and other records are persisted in browser `localStorage`; users/current-user/login state are also written there. No shared application database/API was evident in the bundle (visible network calls relate to local printer discovery/printing). Different staff devices therefore do not share one authoritative catalogue. A 30,000-record local-storage probe also failed at the browser quota. This implementation should **not be treated as production-ready for 30,000 books or real member records** until its data/auth architecture is replaced and tested.

The audit could not verify authenticated screens, real circulation workflows, permissions, import/export integrity, backups, performance at 30,000 records, or backend security. Those are explicitly marked as unverified rather than asserted to be broken.

## Findings, prioritized

### P0 — Replace browser-only data and authentication before real deployment

**Evidence:** The deployed bundle reads/writes keys such as `rahula_lms_books`, `rahula_lms_members`, `rahula_lms_circulation`, `rahula_lms_fines`, `rahula_lms_inventory`, `rahula_lms_users`, `rahula_lms_current_user`, and `rahula_lms_logged_in` via `localStorage`.

**Why it matters:** Browser storage is per browser profile/device, not a central shared database. Concurrent users will have divergent data; a cleared browser/profile/device loss can remove its records; local data can be inspected or modified by the user; and client-side login state is not an access-control boundary. If passwords are stored in the user objects, they must be treated as compromised until confirmed otherwise. No real student/member data should be entered until this is resolved.

**Fix:** Add a server-side API and shared relational database (for example PostgreSQL) with server-enforced authentication, authorization and validation. Store only short-lived session credentials securely (prefer secure, HttpOnly, SameSite cookies); never trust role or login flags supplied by browser storage. Hash passwords with a modern password-hashing scheme; support password reset, session expiry/revocation and audit events. Migrate demo/local records carefully, with reconciliation and backups, rather than silently treating each browser's copy as authoritative.

### P0 — Prove backup, restore, audit trail and data integrity

**Evidence:** The public bundle includes local-browser persistence and mentions a JSON database export/backup, but the unauthenticated audit cannot establish whether this is a validated, recoverable central backup.

**Risk:** A downloadable export from one browser is not a system backup and cannot protect against device loss, corruption, accidental edits, or concurrent changes.

**Fix:** Implement scheduled encrypted database backups, point-in-time recovery where supported, retention policy, restore drills, and documented recovery objectives. Record who changed a book, copy, member, loan, return, fine or settings item and when. Use database transactions/constraints for checkout/return so stock and loan state cannot diverge.

### P1 — Design for 30,000 titles and potentially many more physical copies

**Evidence:** The bundle contains collection-management views; no server-side pagination/search API was evident. In a controlled browser-local probe using 30,000 synthetic title records with two mock copy objects each (about 24.6 MB serialized), `localStorage.setItem` failed with `QuotaExceededError`. The temporary probe key was removed immediately. This confirms the browser storage limit blocks that test-size catalogue; it is not a backend load test.

**Fix:** Model **title/edition** separately from **physical copy/barcode**. Add ISBN-10/13 normalization and duplicate detection; unique copy/barcode constraints; acquisition/deletion status; location hierarchy (branch/room/shelf); and item-level availability. Use indexed server-side search, filters and pagination (not loading/filtering the full catalogue in the browser). Search by title, author, ISBN, accession/barcode and subject; support exact barcode lookup for circulation. Test realistic data volumes, simultaneous checkouts, imports and reports with at least 30,000 titles plus the expected number of copies and users. Measure p95 search/circulation latency and memory on low-end school devices.

### P1 — Distinguish ISBN, accession number, and copy barcode

**Observed:** The new-book form labels the required identifier “Parigahana Ankaya” (accession number), but the catalogue column and issue screen call the value “ISBN.” The circulation slip also labels that same value as ISBN while showing it as a barcode. The mock test confirmed that an accession-style value flowed into the ISBN display.

**Fix:** Store and label `ISBN`, library accession number, and physical-copy barcode as separate fields. Allow one title-level ISBN, a distinct accession/copy record per physical item, and validate barcode uniqueness. Update catalogue columns, scanner prompts, receipts, imports, and reports so they show the correct identifier.

### P1 — Prevent stale returns from remaining actionable

**Observed:** After returning the mock loan, the active-loan count correctly became zero. After signing out and back in, the Returns Desk still showed the already-returned transaction selected and an enabled “Confirm Check-In & Print Clearance Slip” button despite reporting zero active loans. I did not click the stale action.

**Fix:** Clear selected transaction state on return, sign-out, and account/session changes. Disable confirmation unless the selected loan is still active, and revalidate transaction status at action time. Show a clear “No active loan selected” state instead of retaining stale details.

### P1 — Clarify account setup and public entry actions

**Observed:** The entry screen offers **Sign In**, **Register**, and **Setup** at the same visual level. The email field is prefilled with `admin@rahulacollege.lk`; no explanation says whether this is an example, a first-admin account, or a suggested institutional address.

**Additional workflow inspection:** The setup form requests Chief Librarian Name, Admin Email, Admin Password, and Library Name, then offers “Complete Setup & Launch.” Using explicitly synthetic test-only values, I completed setup, created a mock category/title/member, exercised issue and return, signed out, and signed in again in this browser profile. Registration lets a visitor select Student, Teacher, or Staff; no approval requirement or eligibility instructions are shown. The reset screen offers “Send Reset Link.” Because the bundle shows browser-local account storage and no application API/email integration, these account flows are not verified as real institution-wide workflows.

**Fix:** State clearly who may register, whether registration needs staff approval, and what Setup does. Make first-time setup a protected, one-time administrator flow; do not leave an unrestricted production setup route. Remove misleading credential prefill or label it explicitly as an example. Add a helpful, safe empty/error state for unconfigured systems. Give the institution an administrator-approved recovery route.

### P1 — Make the sign-in page feel like a usable school system, not a generic dark template

**Observed in the 1280×720 view:** A small, narrow login card is centered in a very large nearly black empty canvas. The card uses dense small text, a saturated dark-red primary button, and low-contrast secondary text. The page is branded “Rahula College” but offers little reassurance about library access or who should sign in. “Systems by Ink.q” is small and the Netlify promotional badge is visible at the bottom-right.

**Fix:** Use the college’s approved identity and a clearer visual hierarchy: larger legible form labels, readable secondary text, restrained brand colors, visible focus states, and more balanced use of available desktop space. Add one concise line such as “For students and library staff” only if that accurately describes supported access. Remove or hide hosting-provider promotional chrome from the production experience if possible. Check at 320–375 px mobile width and tablet/desktop, including zoom and keyboard-only use.

### P1 — Improve wording and avoid robotic/unclear labels

**Observed wording:** “Digital Library & Resource Hub” is broad and does not tell a visitor what actions are available. “Setup” is ambiguous. “Forgot?” is terse. “Systems by Ink.q” reads like a template/vendor stamp rather than a useful support path.

**Suggested labels:**
- “Set up library” → “Initial setup” (only for the authorized administrator)
- “Forgot?” → “Forgot password?”
- Identify role/audience in plain language, e.g. “Staff sign-in” or “Student and staff sign-in,” based on actual policy.
- Replace the vendor-only footer with a real help contact/service desk route, if one exists.

Avoid claims such as “Digital Library” or “Resource Hub” if this system only manages physical holdings. Use friendly, direct instructions and specific error messages; do not use vague success/failure language.

### P1 — Make Zebra label printing approachable and resolve size contradictions

**Observed on the Zebra ZD230 Label Studio page:** It opens with an engineering-style dark hero, jargon-heavy “3-Sticker Roll Manager” copy, several competing print actions (“Copy ZPL,” “Download .ZPL,” “Browser Print,” “Send ZPL to Zebra (USB)”), and protocol details such as ZPL-II, `^PW768`, localhost port 9101, and “Force Print 1 Sticker Now.” A large connection instruction panel and a command-script preview compete with the task of choosing books and printing labels. The screen calls the roll/row 96 mm in some places and 98 mm in others. Three 30 mm stickers, two 2 mm gaps, and two 2 mm side margins total 98 mm, while the displayed ZPL print width `^PW768` is described as 96 mm at 8 dots/mm. The UI therefore presents inconsistent physical sizing; the actual printer/media dimensions were not verified.

**Recommended redesign:** Call the page **“Print book labels”** and make it a short, guided flow: (1) choose books or enter accession/barcode, (2) select the verified label stock/printer, (3) preview queued labels, (4) print. Use one prominent primary action and put ZPL copy/download, printer authorization, port details, and calibration controls under **Advanced printer settings**. Replace “Force Print 1 Sticker Now” with a clear option such as “Print partial row” and explain when unused positions remain blank. Show a plain-language printer connection status and recovery steps. Keep a visible label preview with exact size and truncation warnings for long titles. Reconcile roll width, printable width, margins, gaps, slot X-coordinates, DPI, and ZPL `^PW` against the actual Zebra model and installed media; test a calibration page before production. No hardware printing was performed during this audit.

### Design direction — restrained black-and-white interface

**User request:** Replace the robotic-looking login/UI with a monochrome black-and-white design. Treat this as a visual redesign, not a substitute for the backend/security fixes above.

**Design brief:** Use a clean white canvas, black type and controls, thin black/neutral borders, generous spacing, and a restrained typographic hierarchy. Avoid gradients, saturated red/yellow/green accents, excessive dark panels, decorative status badges, emoji-like iconography, and oversized technical banners. Keep real feedback accessible through explicit text, icons, focus outlines, and contrast—not color alone. The login should present the college/library identity, a clear **“Staff sign in”** heading (only if staff-only is the actual policy), labeled email/password fields, a full **“Forgot password?”** link, and one high-contrast black **“Sign in”** button. Place authorized first-time setup separately from routine sign-in; do not show Register/Setup as equal primary actions without explaining who may use them. Keep useful error messages, keyboard focus, WCAG contrast, and mobile layout. Apply the same restrained system to the printer page, but preserve the step-by-step task guidance described above.

**Do not implement a literal two-color palette by removing necessary affordances.** Use black/white for the brand, with readable neutral surface differences only where needed to distinguish cards, disabled controls, selected rows, and warnings. Test text and focus contrast, keyboard/screen-reader states, and 200% zoom after redesign.

### P1 — Accessibility and responsive checks are required

**Observed/unknown:** The extracted page exposes labels and buttons, but a screenshot/text extraction cannot establish correct label associations, keyboard order, screen-reader announcements, password visibility semantics, validation, or responsive behavior. The UI text and controls appear small in the desktop capture.

**Fix/test:** Verify WCAG 2.2 AA contrast, visible keyboard focus, semantic form labels, Enter-to-submit, tab order, accessible show-password button name/state, and announced inline errors. Test 200% zoom, mobile widths, long email addresses, browser autofill, and reduced motion. Do not use color alone for errors/status.

### P2 — Public technical and discoverability cleanup

**Observed:** `/robots.txt`, `/sitemap.xml`, and `/manifest.json` returned 404. These are not necessarily functional defects for a private library app; a sitemap may intentionally be unnecessary. The response showed HSTS, but the limited header check did not find CSP, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`.

**Fix:** Decide intentionally whether robots should disallow indexing of the private app; provide an explicit robots policy if appropriate. A sitemap is only needed if there are public pages meant to be indexed. Review and configure a restrictive Content Security Policy and other security headers at the hosting/CDN layer, including `X-Content-Type-Options: nosniff` and a suitable `Referrer-Policy`. Validate headers against required scripts, fonts and printing integrations before enforcement.

## Public checks and results

| Check | Result |
|---|---|
| Home page | HTTP 200; React UI rendered |
| Browser console on landing-page visit | No console output/errors returned |
| Setup and same-browser authentication | Mock setup submitted; sign-out/sign-in succeeded in this browser profile |
| Catalogue, category, member, issue, return | One synthetic title (two copies), one mock member, and one issue/return cycle succeeded |
| Network/API evidence in deployed bundle | No shared application API/auth/email integration detected; visible `fetch` calls are for local printer discovery/printing |
| 30,000-title storage probe | 30,000 synthetic titles / 24.6 MB failed in browser `localStorage` with `QuotaExceededError`; temporary probe removed |
| Returned-loan state after re-login | Stale transaction remained selected with enabled check-in action despite zero active loans; action not clicked |
| ISBN/accession label consistency | Accession number displayed as ISBN in catalogue/circulation views |
| Zebra ZD230 Label Studio | Screen inspected; no USB/browser print or hardware connection attempted |
| Printer-media dimensions | Conflicting 96 mm/98 mm statements and a dimensional arithmetic mismatch observed; physical stock not verified |
| Logo and favicon | Both returned HTTP 200 |
| `robots.txt`, `sitemap.xml`, `manifest.json` | HTTP 404 |
| HSTS | Present (`max-age=31536000; includeSubDomains; preload`) |
| Authenticated mock workflows | Setup, sign-in, book/category/member creation, issue, return, sign-out/sign-in tested; all data synthetic and browser-local |
| Production 30,000-record performance | Not tested; no shared backend available; browser-local capacity probe failed as described above |

## Recommended order of work

1. **Pause real-data use** until server-side authentication and a shared database are confirmed and deployed.
2. Confirm whether the current app is a prototype/demo; review the setup/register and auth implementation with the code owner.
3. Design the title/copy/member/loan schema, migration, permissions, audit trail and backup/restore plan.
4. Add server-side search, pagination, indexing and transactional circulation; test with representative 30,000-title data and concurrent staff.
5. Refine the sign-in page copy, hierarchy, accessibility and small-screen layout.
6. Redesign the label studio as a guided monochrome print workflow; confirm all label/media measurements and test on the actual printer before enabling production printing.
7. Run end-to-end, security, import/export, recovery and load tests before accepting real school records.

**Bottom line:** The visible login page is reachable, but the app’s browser-local data/auth approach is the major issue. Visual polish matters, yet it is secondary to preventing split, lost, or tampered library records.
