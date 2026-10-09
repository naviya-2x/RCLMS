# RCLMS Catalogue Import and Arena AI Guidelines

## Recommended data model

Do not keep the entire form as one production row when a title can have multiple physical copies. Use two related tables:

- `books`: title-level metadata such as title, author, ISBN/accession information, language, DDC, publisher, synopsis, and general shelf area.
- `physical_copies`: one row per physical copy with barcode, copy number, shelf, condition, and circulation status.

The existing label **Number of Copies to Print** should be changed to **Number of physical copies to add**. Printing labels is a separate operation.

## Field mapping from the current form

| Current form label | Import column | Table | Rule |
|---|---|---|---|
| Book Title | `book_title` | `books` | Required; trim whitespace |
| Subtitle | `subtitle` | `books` | Optional |
| Author | `author_name` | `books` | Required; do not leave blank |
| Parigahana Ankaya | `book_accession_number` | `books` | Required and unique; this is not ISBN |
| Language Medium | `language_medium` | `books` | Use approved reference values |
| Category (DDC) | `ddc_code`, `category_name` | `books` | DDC code required; validate format |
| Publisher | `publisher` | `books` | Optional but recommended |
| Publication Year & Edition | `publication_year`, `edition` | `books` | Year must be 1000–2100 |
| Number of Copies to Print | `number_of_physical_copies_to_add` | `books` | Integer ≥ 0; does not print labels |
| Shelf Identifier | `shelf_identifier` | `books` and `physical_copies` | Copy-level value overrides title default |
| Synopsis / Academic Notes | `synopsis_academic_notes` | `books` | Plain text; no HTML/scripts |
| Keywords / Search Tags | `keywords` | `books` | Comma-separated in import; normalize later if needed |
| Generated barcode | `copy_barcode` | `physical_copies` | Required for each physical copy |

## Excel workbook

Use the included workbook:

- `books_import` has one row per title.
- `copies_import` has one row per physical copy.
- `reference_values` contains approved language, condition, status, and edition examples.
- `README` explains the import order.

Delete or replace the example rows before importing real data.

## Supabase import sequence

1. Run `rclms_supabase_catalogue_schema.sql` in the Supabase SQL Editor.
2. Import `books_import.csv` into `public.books`.
3. Validate duplicate accession numbers and missing required values.
4. Create or export the copy rows. Each copy must have a unique `copy_barcode` and `book_accession_number` matching an existing book.
5. Resolve `book_accession_number` to `books.id` in a staging table or import script.
6. Insert into `public.physical_copies`.
7. Confirm counts: number of imported titles, copies, rejected rows, duplicate rows, and unresolved parent references.
8. Never import passwords, members, loans, fines, or roles through this catalogue workbook.

## Arena AI implementation guidelines

### System role

You are Arena AI, implementing the RCLMS catalogue workflow for a school library. Build a calm black-and-white interface that is safe for a catalogue of at least 30,000 titles and many physical copies per title.

### Core requirements

- Use a two-level data model: `books` for title metadata and `physical_copies` for copy inventory.
- Do not store catalogue records in `localStorage`.
- Use Supabase tables, server-side validation, authenticated access, and row/action permissions.
- Use pagination, indexed search, filters, and debounced queries. Never download all 30,000 titles to the browser.
- Treat `book_accession_number`, ISBN, and `copy_barcode` as different identifiers.
- Reject duplicate accession numbers and duplicate copy barcodes.
- Do not silently use a General category if the required DDC category is missing.
- The form label must say **Number of physical copies to add**, not **Number of Copies to Print**.
- Label printing must be a separate action after copies are created.
- Do not expose passwords, seeded admin credentials, or public Super Admin setup.

### Required form sections

1. **Title metadata:** title, subtitle, author, language, DDC/category, publisher, publication year, edition.
2. **Library placement:** default shelf identifier only.
3. **Academic information:** synopsis/academic notes and keywords.
4. **Physical copies:** number to add, generated or scanned barcode, copy shelf, condition, and status.
5. **Review:** display the final title and copy summary before saving.

### Validation rules

- `book_title`, `author_name`, `book_accession_number`, `language_medium`, and `ddc_code` are required.
- Trim leading/trailing spaces from all text fields.
- `book_accession_number` must be unique and should follow the library format, for example `RC-BK-7784`.
- `publication_year` must be a four-digit year between 1000 and 2100.
- `number_of_physical_copies_to_add` must be an integer from 0 upward.
- Each physical copy must have a unique barcode.
- DDC must be validated according to the library’s chosen rule; do not accept arbitrary text without feedback.
- Preserve entered values when validation fails.
- Show field-level messages and a form-level summary.

### Save behavior

- Create the parent book first.
- Create physical copies only after the book insert succeeds.
- If a copy insert fails, show exactly which copies failed and provide retry/export options.
- Prevent duplicate submissions while saving.
- Use a transaction or compensating rollback so a failed import does not leave an incomplete title.
- Record `created_at`, `updated_at`, and the authenticated staff member responsible for the change.
- Show a success summary: title created, copies created, copies failed, and next actions.

### Black-and-white UI rules

- White or near-white background, black primary actions, neutral gray borders.
- No gradients or saturated decorative colors.
- Use visible text labels for status: Available, On loan, Reserved, Damaged, Lost, Archived.
- Keep one primary action: **Save book and copies**.
- Use **Cancel** and **Review before saving** as secondary actions.
- Keep labels above fields; do not use placeholders as labels.
- Add visible keyboard focus and accessible names to every control.
- Use a single H1: **Catalog new book to library**.

### Example user-facing copy

**Catalog new book to library**

Register title metadata and add physical copies to the library inventory.

**Book accession number**
The unique library record identifier, for example `RC-BK-7784`. This is not the ISBN.

**Number of physical copies to add**
Creates inventory records. It does not print labels.

**Review before saving**
You are about to create 1 title and 1 physical copy. Confirm the details before saving.

### Import UX

Provide an Import Catalogue action with:

- UTF-8 `.xlsx` and `.csv` support.
- Preview of the first 20 rows.
- Column mapping when headers differ.
- Required-field validation before import.
- Duplicate detection for accession numbers and barcodes.
- A downloadable rejected-rows report.
- Progress indicator and final summary.
- Dry-run mode that changes nothing.
- Explicit confirmation before committing a large import.

Do not claim that an import succeeded until Supabase confirms the inserts.
