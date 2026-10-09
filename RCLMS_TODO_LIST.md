# RCLMS Todo List

## P0 — Do before real use

- [ ] Sign in with `admin@rahulacollege.lk`.
- [ ] Change the temporary administrator password immediately.
- [ ] Confirm that the administrator profile shows the `super_admin` role.
- [ ] Confirm that only authorized staff can open administration and settings screens.
- [ ] Create separate staff accounts for the Chief Librarian, librarians, and assistants.
- [ ] Do not share the administrator account with ordinary staff.
- [ ] Confirm Supabase Auth email and password policies.
- [ ] Confirm the production Supabase project URL and publishable key are used in the deployed app.
- [ ] Remove any development-only or temporary credentials from local notes before wider distribution.

## P0 — Deploy the repaired application

- [ ] Decide whether the production app will remain on Netlify or move to another host.
- [ ] Connect the repaired workspace to the production Git repository.
- [ ] Configure the production environment variables:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY` or the project’s publishable key
- [ ] Deploy the repaired build to the production site.
- [ ] Confirm the production site no longer shows the old dark login screen.
- [ ] Confirm the production site no longer shows the old duplicate branding.
- [ ] Test the production URL on desktop and mobile.
- [ ] Confirm browser refresh works on every route.
- [ ] Confirm the production site uses HTTPS.

## P0 — Import the real catalogue

- [ ] Prepare the final Excel catalogue using the simplified import template.
- [ ] Remove duplicate book titles before importing.
- [ ] Confirm every book has a title.
- [ ] Confirm every book has an author.
- [ ] Confirm every book has a valid DDC category.
- [ ] Confirm every book has a unique accession number or barcode.
- [ ] Confirm every physical copy has a unique barcode.
- [ ] Confirm the accession number is not being confused with ISBN.
- [ ] Confirm publication years are valid four-digit years.
- [ ] Confirm language values use only:
  - [ ] Sinhala
  - [ ] English
  - [ ] Tamil
  - [ ] Pali
- [ ] Confirm number of copies matches the physical stock.
- [ ] Confirm shelf identifiers are real and approved by the library.
- [ ] Import categories first.
- [ ] Import authors and publishers second.
- [ ] Import book titles third.
- [ ] Import physical copies last.
- [ ] Verify imported counts against the source Excel file.
- [ ] Scan a sample of physical barcodes after import.

## P1 — Configure the library

- [ ] Set the official library name.
- [ ] Set the institution name.
- [ ] Confirm the official address.
- [ ] Confirm the official phone number.
- [ ] Confirm the official library email.
- [ ] Set weekday opening hours.
- [ ] Set Saturday opening hours.
- [ ] Set student borrowing limit.
- [ ] Set teacher borrowing limit.
- [ ] Set staff borrowing limit.
- [ ] Set student loan period.
- [ ] Set teacher loan period.
- [ ] Set staff loan period.
- [ ] Set the overdue fine per day in LKR.
- [ ] Set the grace period.
- [ ] Set the maximum renewal count.
- [ ] Set due-date reminder timing.
- [ ] Decide whether overdue email notifications will be enabled.

## P1 — Test authentication and permissions

- [ ] Test administrator sign-in.
- [ ] Test librarian sign-in.
- [ ] Test assistant librarian sign-in.
- [ ] Test teacher sign-in.
- [ ] Test student sign-in.
- [ ] Confirm students cannot create staff or administrator accounts.
- [ ] Confirm students cannot edit catalogue records.
- [ ] Confirm teachers cannot change system settings.
- [ ] Confirm assistants can perform only the operations assigned to them.
- [ ] Confirm administrators can manage users and roles.
- [ ] Test forgot-password flow.
- [ ] Test sign-out.
- [ ] Test session expiry.
- [ ] Test signing in from a second browser.

## P1 — Test catalogue workflows

- [ ] Add a new category with a valid DDC code.
- [ ] Add an author.
- [ ] Add a publisher.
- [ ] Add a book title.
- [ ] Add one physical copy.
- [ ] Add multiple physical copies.
- [ ] Edit a book title.
- [ ] Edit an accession number only when operationally permitted.
- [ ] Search by title.
- [ ] Search by author.
- [ ] Search by accession number.
- [ ] Filter by category.
- [ ] Filter by language.
- [ ] Confirm available-copy counts.
- [ ] Confirm total-copy counts.
- [ ] Confirm deleting a book is restricted and intentional.
- [ ] Confirm a book with active loans cannot be deleted incorrectly.

## P1 — Test circulation workflows

- [ ] Register a member.
- [ ] Issue an available book.
- [ ] Confirm the physical copy changes to borrowed.
- [ ] Confirm the available count decreases.
- [ ] Confirm the member loan count increases.
- [ ] Return the book in good condition.
- [ ] Confirm the physical copy becomes available again.
- [ ] Return a damaged book.
- [ ] Confirm the physical copy becomes damaged.
- [ ] Issue a book to a member at the borrowing limit.
- [ ] Confirm a member over the limit cannot borrow another book.
- [ ] Test an overdue return.
- [ ] Confirm the fine is calculated correctly.
- [ ] Test paying a fine.
- [ ] Test waiving a fine with a reason.
- [ ] Test renewing a loan.
- [ ] Test returning a renewed loan.
- [ ] Test barcode-based return lookup.
- [ ] Test transaction-ID-based return lookup.

## P1 — Test backups and recovery

- [ ] Export a full JSON backup.
- [ ] Store a copy outside the application server.
- [ ] Decide how often backups will run.
- [ ] Test restoring a backup in a non-production environment.
- [ ] Confirm backups do not contain plaintext passwords.
- [ ] Confirm the database migration history is retained.
- [ ] Document who is responsible for recovery.
- [ ] Document the maximum acceptable data-loss window.

## P2 — Improve the physical library process

- [ ] Finalize shelf naming conventions.
- [ ] Label every shelf consistently.
- [ ] Print and attach physical copy labels.
- [ ] Scan a sample of labels into the app.
- [ ] Complete a first inventory audit.
- [ ] Record missing copies.
- [ ] Record damaged copies.
- [ ] Record misplaced copies.
- [ ] Reconcile the inventory audit with the catalogue.
- [ ] Establish a regular inventory cycle.

## P2 — Improve reporting

- [ ] Confirm required daily circulation report.
- [ ] Confirm monthly borrowing report.
- [ ] Confirm overdue report.
- [ ] Confirm fine collection report.
- [ ] Confirm popular-books report.
- [ ] Confirm category utilization report.
- [ ] Confirm member activity report.
- [ ] Add export to CSV or Excel where required.
- [ ] Add date-range filtering to reports.

## P2 — Improve UX after staff testing

- [ ] Observe a librarian completing a real book-cataloguing task.
- [ ] Observe a librarian issuing a book at the desk.
- [ ] Observe a librarian processing a return.
- [ ] Record confusing labels and unnecessary fields.
- [ ] Remove fields staff never use.
- [ ] Add keyboard shortcuts only where they improve speed.
- [ ] Confirm all forms work on a smaller laptop screen.
- [ ] Confirm all important buttons have clear labels.
- [ ] Confirm errors explain how to fix the problem.
- [ ] Confirm success messages describe the saved record.
- [ ] Confirm empty states tell staff what to do next.

## P2 — Performance and scale

- [ ] Test with at least 1,000 books.
- [ ] Test with 10,000 books.
- [ ] Test with the expected 30,000-book catalogue.
- [ ] Measure catalogue search response time.
- [ ] Add server-side search if loading the full catalogue becomes slow.
- [ ] Add server-side filtering and pagination to catalogue screens.
- [ ] Review bundle-size warnings and split large application chunks.
- [ ] Monitor Supabase query performance after real usage begins.
- [ ] Remove indexes only after confirming they are genuinely unnecessary.

## P3 — Future improvements

- [ ] Add automated overdue email notifications.
- [ ] Add member self-service borrowing history.
- [ ] Add reservation queue management.
- [ ] Add audit-log viewer for administrators.
- [ ] Add role-specific dashboards.
- [ ] Add cover-image support if the library wants it.
- [ ] Add ISBN lookup only if an approved external data source is selected.
- [ ] Add barcode scanner hardware workflow.
- [ ] Add automated daily database backups.
- [ ] Add uptime monitoring for the production deployment.
- [ ] Add error monitoring for frontend failures.

## Launch sign-off

- [ ] Chief Librarian approves the catalogue fields.
- [ ] Chief Librarian approves borrowing rules.
- [ ] Administrator approves user roles.
- [ ] Staff complete a test circulation session.
- [ ] First catalogue import is reconciled.
- [ ] First inventory audit is completed.
- [ ] Backup and restore test is successful.
- [ ] Production URL is confirmed.
- [ ] Temporary administrator password has been changed.
- [ ] Launch date and support owner are recorded.
