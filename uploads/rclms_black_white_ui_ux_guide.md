# RCLMS Black-and-White UI/UX Design Guide

## 1. Design direction

The Rahula College Library Management System should feel **calm, trustworthy, efficient, and institutional**. The interface should reduce visual noise so librarians can complete frequent tasks quickly: search a book, issue a copy, process a return, add members, and review overdue items.

The visual system uses black, white, and neutral grays. Color is not required to understand the interface. Status, errors, permissions, and actions must also be communicated through text, icons, borders, and placement.

### Design principles

1. **Clarity before decoration.** Every screen should make its purpose and next action obvious.
2. **One primary action.** Do not place several competing buttons at the same visual level.
3. **Quiet hierarchy.** Use spacing, typography, borders, and weight instead of gradients or saturated colors.
4. **Safe operations.** Review consequential actions before confirmation and explain what will happen.
5. **Fast routine work.** Optimize for repeated keyboard-and-search workflows.
6. **Accessible by default.** The system must work without color, a mouse, or perfect vision.
7. **Consistent language.** Use the same terms everywhere: title, edition, physical copy, member, loan, return, reservation, and fine.

## 2. Color system

Use the following tokens instead of choosing colors ad hoc.

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#111111` | Main text, primary button, strong headings |
| `ink-800` | `#262626` | Secondary text, icons, navigation |
| `ink-600` | `#5F5F5F` | Supporting text, metadata |
| `ink-400` | `#9A9A9A` | Disabled text, nonessential dividers |
| `line-300` | `#D6D6D6` | Borders, table rules, input outlines |
| `surface-100` | `#F5F5F5` | Secondary panels, table headers, hover background |
| `surface-050` | `#FAFAFA` | Page background |
| `paper` | `#FFFFFF` | Cards, dialogs, forms |
| `focus` | `#111111` | Keyboard focus ring; pair with a white offset |
|

### Contrast rules

- Body text must meet at least **4.5:1** contrast against its background.
- Large text must meet at least **3:1**.
- Do not use light gray for essential text.
- A gray border alone must not be the only indication of an error, selected row, or disabled state.
- Never communicate status by color alone. Use labels such as **Available**, **On loan**, **Overdue**, **Archived**, or **Permission denied**.

## 3. Typography

Use a highly readable sans-serif system stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

| Style | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| Page title | 32px | 700 | 1.2 | One H1 per page |
| Section title | 22px | 700 | 1.3 | Major content sections |
| Card title | 16px | 700 | 1.35 | Cards and panels |
| Body | 15px | 400 | 1.5 | Default interface text |
| Small/meta | 13px | 400 | 1.45 | Dates, IDs, supporting information |
| Button/input | 14px | 600 | 1.2 | Controls |
| Table data | 14px | 400 | 1.4 | Dense catalogue rows |

Use sentence case. Avoid all-caps labels except short technical identifiers such as ISBN when appropriate. Do not use multiple H1 headings on a page.

## 4. Spacing and layout

Use an 8px base spacing scale:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Recommended layout

- App shell: fixed left navigation and flexible content area.
- Content maximum width: `1440px`.
- Page horizontal padding: `32px` on desktop, `20px` on tablet, `16px` on mobile.
- Card padding: `24px` for major panels, `16px` for compact panels.
- Form field gap: `16px`.
- Major section gap: `32px`.
- Minimum clickable target: **44 × 44px**.
- Border radius: use restrained values, preferably `6px` for controls and `8px` for cards. Avoid excessive pill-shaped elements.

The page should contain one clear title row, optional context or filters, the main work area, and a clear empty/loading/error state.

## 5. Application shell

### Desktop navigation

The primary navigation should be simple and task-oriented:

- Dashboard
- Books catalogue
- Members
- Issue books
- Returns desk
- Reservations
- Fines
- Reports
- Access control
- Settings

Place the signed-in user, role, and sign-out action at the bottom of the navigation. Keep hardware-specific wording out of primary navigation; use **Print labels** rather than **Zebra ZD230 Labels**.

### Navigation behavior

- Highlight the current location with a black vertical rule or black background and white text.
- Preserve the page title and current section on narrow screens.
- Do not rely on icons alone. Every navigation item needs visible text.
- On mobile, use a labeled menu button and keep the current page title visible.

## 6. Buttons and actions

### Button hierarchy

```text
Primary:    black background, white text
Secondary:  white background, black border, black text
Tertiary:   text-only, black text, underline or clear hover state
Destructive: white background, black border, explicit “Delete” or “Archive” label
```

Examples:

- Primary: **Issue book**, **Save changes**, **Add physical copy**
- Secondary: **Cancel**, **Export**, **Print labels**
- Tertiary: **View details**, **Clear filters**
- Destructive: **Archive category**, **Delete member**

Avoid vague labels such as **Go**, **Done**, **Action**, or **Submit**. Use a verb and object.

### Button rules

- Place the primary action at the right side of a form footer on desktop and full width on small screens.
- Keep Cancel next to the primary action, visually quieter.
- Disable a button only when the user can understand why. Explain the prerequisite beside it.
- Show a loading label such as **Saving…** and prevent duplicate submissions.
- After saving, show a concise confirmation and preserve the user’s workflow context.

## 7. Forms and validation

### Form structure

Every form should have:

1. A clear title and one-sentence purpose.
2. Labels above controls, never placeholder text as the only label.
3. Required-field indicators and a short explanation.
4. Inline validation after interaction and a summary at the top after submit.
5. Preserved values after an error.
6. Unsaved-change protection when leaving.
7. A visible Cancel action.

### Input examples

Use precise labels:

- **ISBN-13** — published-edition identifier.
- **Library accession number** — library title or item identifier.
- **Physical-copy barcode** — identifier for one copy.
- **Number of physical copies to add** — creates inventory; it does not print labels.
- **DDC code** — include an accepted format example.

Never silently substitute a category such as General when a required category is missing. Explain the prerequisite and provide **Create category** or **Cancel**.

### Error message pattern

```text
[Field label]
Specific explanation of what is wrong.
How to fix it.
```

Example: **Barcode** — This barcode is already assigned to another physical copy. Enter a unique barcode or open the existing copy.

## 8. Tables and catalogue screens

A 30,000-book system should use server-side search, filtering, sorting, and pagination. Do not load the entire catalogue into the browser.

### Catalogue toolbar

The toolbar should contain:

- Search by title, author, ISBN, accession number, or barcode.
- Filters for category, availability, language, publisher, and condition.
- A result count such as **Showing 1–25 of 30,000 titles**.
- Clear filters.
- Add book as the one primary action.

### Table design

Recommended columns:

| Title | Author | ISBN | Copies | Available | Category | Updated | Actions |
|---|---|---|---:|---:|---|---|---|

Rules:

- Keep row actions behind a labeled **More** menu or use clear inline actions.
- Use a sticky table header only when it improves scanning.
- Do not truncate essential identifiers without a way to view the full value.
- Use pagination with page size options such as 25, 50, and 100.
- Preserve search and filter state when opening and returning from a detail page.
- Provide distinct states: empty catalogue, no search results, loading, server error, and permission denied.

## 9. Dashboard design

The dashboard should answer four questions immediately:

1. What needs attention today?
2. How many active loans and overdue loans exist?
3. What is the current catalogue/member status?
4. What is the next common task?

### Recommended layout

**Top row:** active loans, overdue loans, available copies, registered members.

**Main row:** attention queue for overdue items and reservations.

**Action row:** **Issue a book**, **Process a return**, **Add a book**, and **Add a member**.

**First-run state:** Create categories → Add books and physical copies → Add members → Begin circulation.

Avoid duplicate Issue/Return buttons across the hero, cards, quick operations, and empty states. Keep one prominent entry point for each task.

Do not call data **Real-time** unless the interface shows the last updated time and handles refresh, loading, stale data, and error states.

## 10. Issue and return workflows

### Issue a book

1. Search or scan the member.
2. Confirm member identity and account status.
3. Search or scan the physical copy.
4. Show title, copy barcode, condition, and availability.
5. Show due date and applicable loan policy.
6. Review the transaction.
7. Confirm with **Issue book**.
8. Display receipt/confirmation and next available action.

### Process a return

1. Search or scan the copy barcode.
2. Show the active loan and member.
3. Show due date, overdue status, and fine preview if applicable.
4. Record condition and staff note when needed.
5. Confirm with **Process return**.
6. Revalidate the loan on the server before committing.
7. Show the final status and allow the next scan.

A stale screen must never authorize a current return. If another user has already completed it, show **This loan was already returned. Refreshing the record.**

## 11. Status, badges, and notifications

Use restrained bordered labels with text:

```text
Available
On loan
Overdue
Reserved
Damaged
Archived
Pending approval
Permission denied
```

Do not use a large collection of decorative badges. Status labels should be short, consistent, and understandable in grayscale and screen readers.

Use notifications for meaningful events only. A notification should include the event, affected record, date/time, and next action where applicable.

## 12. Empty, loading, and error states

### Empty state

Explain what is absent and give one useful next action.

```text
No physical copies yet
Add a physical copy to make this title available for circulation.
[Add physical copy]
```

### No-results state

```text
No books match “history”
Try a different title, author, ISBN, or barcode.
[Clear search]
```

### Loading state

Use a simple skeleton or text such as **Loading catalogue…**. Keep the page structure stable.

### Error state

```text
We couldn’t load the catalogue
Your data was not changed. Try again or contact an administrator if the problem continues.
[Try again]
```

Never show a successful-looking empty state when a server request failed.

## 13. Dialogs and confirmations

Use dialogs only when the user must focus on a decision. Every dialog needs:

- A descriptive title.
- A short consequence statement.
- A visible close button with an accessible name.
- Cancel and confirm actions.
- Focus moved into the dialog and returned afterward.
- Escape-to-close where safe.

Example:

```text
Archive “Science” category?
Books already assigned to this category will remain searchable, but new titles cannot use it.
[Cancel] [Archive category]
```

Do not use confirmation dialogs for harmless navigation or every save. Use them for delete, archive, bulk changes, role changes, and consequential circulation actions.

## 14. Accessibility checklist

- One H1 per page.
- Correct heading order.
- Visible keyboard focus with at least a 2px outline and offset.
- All inputs have associated labels.
- Dialogs use semantic dialog behavior and accessible names.
- Icon buttons have visible tooltips and accessible names.
- Error messages are associated with fields and announced when appropriate.
- Tables have meaningful headers and row context.
- Status is communicated through text, not color alone.
- Keyboard users can complete search, issue, return, save, cancel, and navigation flows.
- Zoom to 200% without loss of core functionality.
- Touch targets are at least 44 × 44px.

## 15. Responsive behavior

### Desktop

Use the full shell with navigation, table views, summary cards, and side-by-side form fields.

### Tablet

Collapse navigation to an expandable rail. Keep catalogue tables horizontally scrollable or switch lower-priority columns into a details view.

### Mobile

Prioritize search, scan, issue, and return. Convert tables into stacked records with labeled fields. Keep primary actions full width. Never hide critical status or actions only inside an unlabeled icon menu.

## 16. Example CSS foundation

```css
:root {
  --ink-950: #111111;
  --ink-800: #262626;
  --ink-600: #5f5f5f;
  --ink-400: #9a9a9a;
  --line-300: #d6d6d6;
  --surface-100: #f5f5f5;
  --surface-050: #fafafa;
  --paper: #ffffff;
  --radius-control: 6px;
  --radius-card: 8px;
  --shadow-card: 0 1px 2px rgb(0 0 0 / 8%);
}

body {
  margin: 0;
  background: var(--surface-050);
  color: var(--ink-950);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  min-height: 44px;
  border-radius: var(--radius-control);
  font-weight: 600;
  cursor: pointer;
}

.button-primary {
  border: 1px solid var(--ink-950);
  background: var(--ink-950);
  color: var(--paper);
}

.button-secondary {
  border: 1px solid var(--ink-950);
  background: var(--paper);
  color: var(--ink-950);
}

:focus-visible {
  outline: 2px solid var(--ink-950);
  outline-offset: 3px;
}
```

## 17. Component review checklist

Before approving a screen, check:

- Can a new user explain the purpose within five seconds?
- Is there exactly one primary action?
- Are the terms consistent with the data model?
- Can the user tell whether the result is empty, filtered, loading, or failed?
- Does the screen work in grayscale?
- Can the complete task be done by keyboard?
- Are destructive or consequential changes reviewable?
- Is the screen usable with 30,000 titles and many copies?
- Does the UI show who can perform the action?
- After an error or save, is the user’s context preserved?

## 18. Recommended implementation order

1. Establish design tokens and typography.
2. Rebuild the application shell and navigation.
3. Create reusable buttons, inputs, tables, dialogs, badges, alerts, and empty states.
4. Redesign Books Catalogue and title/copy forms.
5. Redesign Issue and Return workflows.
6. Redesign Dashboard around attention and next actions.
7. Redesign Members, Reservations, Fines, Reports, Access Control, and Settings using the same components.
8. Run accessibility, grayscale, responsive, and 30,000-title usability checks.
9. Remove remaining gradients, saturated accents, duplicate actions, unclear labels, and hardware-specific language.

The final result should look intentionally monochrome, not unfinished: strong typography, consistent spacing, precise borders, clear states, careful focus treatment, and confident plain-language actions create the visual quality.
