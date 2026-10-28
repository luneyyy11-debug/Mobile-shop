# Mobile Shop OS — Product, Design, and Engineering Roadmap

**Project type:** Offline-first retail POS and shop-management system  
**First device:** Android tablet  
**Target customers:** Mobile-phone and accessories shops; later, general small retailers  
**Commercial goal:** Sell setup, customization, support, and optional hosted/sync services  
**Status:** Planning document — use this as the GitHub Project backlog

---

## 1. Product vision

Build a fast, reliable, touch-friendly shop system that can record sales and manage stock without internet. It should be simple enough for a shop assistant to learn quickly, yet structured well enough to support multiple shops and devices later.

### Product principles

- **Offline-first:** checkout, products, stock movements, and local reports must work when disconnected.
- **Reliable records:** completed sales and stock movements must not be silently overwritten or deleted.
- **Backup-first:** every shop can export and restore its business data.
- **Tenant separation:** one shop's data must never appear in another shop's account.
- **Configurable:** currency, language, receipt details, tax settings, and shop branding are configurable, not hard-coded.
- **Tablet-first, responsive:** large touch controls on tablet; usable layouts on phones and desktop screens.
- **Transparent synchronization:** show whether the app is offline, has pending changes, or has sync errors.
- **No premature complexity:** do one device and one shop reliably first; expand only after core workflows are tested.

## 2. Recommended starting point

### First inspect this existing project

**Olgax POS:** https://github.com/OLGAX-com/olgax-pos

It is an MIT-licensed POS project that describes an offline-capable PWA with local PGLite storage, synchronization, PostgreSQL, staff roles, checkout, stock history, refunds, receipts, and reports. It is identified as an early v0.1 MVP, so treat it as a candidate, not as production-ready software.

Before forking it, complete a short technical review:

- [ ] Read the main README, architecture, deployment, and data-model docs.
- [ ] Read the exact LICENSE file and third-party notices.
- [ ] Inspect database migrations and how local records sync to the server.
- [ ] Trace checkout end-to-end: sale, payment, stock movement, receipt, and report.
- [ ] Test with airplane mode enabled, then reconnect and check whether records sync exactly once.
- [ ] Test refund, duplicate clicks, reloads during checkout, and failed sync.
- [ ] Review authentication, tenant isolation, staff permissions, backups, and recovery.
- [ ] Check current issue activity and whether the project has a clear upgrade path.
- [ ] Record every blocker before deciding whether to fork.

**Decision gate:** continue with Olgax only if you can understand the code, reproduce the offline flow, and fix problems safely. Otherwise use it as a reference and build your own implementation.

### Alternative references

- **Open Source Point of Sale (OSPOS):** https://github.com/opensourcepos/opensourcepos — useful reference for retail features; it is primarily PHP + MySQL/MariaDB and is not the most direct starting point for a tablet-first offline PWA. Its repository adds a specific requirement to retain a visible attribution footer, so read its full license before reuse.
- **Posnic POS:** https://github.com/Posnic/POS — offline-first POS reference. Its project source is AGPL-3.0-only and releases may contain separately licensed components. Do not base a proprietary offering on it without understanding all obligations.
- **Open POS by Sinecord Productions:** https://github.com/sinecordproductions/OPEN-POS_Free-SmartPOS-Software — useful reference for local POS features and backup/restore. It is a Python desktop application, so its deployment model may not match the first tablet version.

Do not copy code without checking the LICENSE file and every relevant dependency's license. “Open source” does not mean “no conditions.”

---

## 3. Product scope and release boundaries

### MVP — must work before a real shop relies on it

- [ ] Shop setup and settings
- [ ] Products, categories, barcode/SKU, variants, cost, selling price, and stock
- [ ] Touch-friendly cashier screen and cart
- [ ] Cash sale and configurable payment methods
- [ ] Automatic stock deduction on completed sale
- [ ] Sales history and receipt reprint
- [ ] Refund/return flow with reason and audit trail
- [ ] Stock receiving and manual stock adjustments with reasons
- [ ] Basic suppliers and purchase receiving
- [ ] Expenses
- [ ] Basic sales, stock, and profit-estimate reports
- [ ] Offline app loading and offline data operations
- [ ] Export and restore backups
- [ ] Admin/cashier roles and protected settings
- [ ] Automated tests for checkout, stock, refunds, and data integrity

### Release 1 — after the MVP passes real-world testing

- [ ] Barcode camera scanning and keyboard-wedge scanner support
- [ ] Thermal receipt printer support for tested printer models
- [ ] Customer directory and purchase history
- [ ] Cash drawer session: opening float, cash in/out, close count, and discrepancy
- [ ] Low-stock alerts and reorder list
- [ ] CSV export and improved reports
- [ ] Arabic/English localization and right-to-left layout if the target market needs it
- [ ] Optional product serial/IMEI and warranty tracking for devices that require it
- [ ] Versioned data migrations and a safer update process
- [ ] Onboarding wizard and demo/sample data

### Release 2 — only after stability and customer demand are proven

- [ ] Multiple devices per shop with reliable synchronization
- [ ] Multiple branches and per-branch inventory
- [ ] Cloud backup and remote dashboard
- [ ] Purchase orders and supplier balances
- [ ] Customer credit/accounts, if requested and legally/accounting-appropriate
- [ ] Advanced analytics and scheduled exports
- [ ] Optional license/subscription management
- [ ] Windows packaging or dedicated Android packaging if PWA limitations require it

### Explicitly out of scope for the first release

- [ ] Complex accounting ledger or claims of tax/legal compliance
- [ ] Payroll, banking, or online payments
- [ ] Artificial intelligence features unrelated to core retail workflows
- [ ] Multi-device offline stock guarantees without a tested conflict strategy

---

## 4. Design system and screen specifications

### Global shell

**Tablet layout:** left sidebar + top header + content area.  
**Phone layout:** compact header + bottom navigation for primary destinations; secondary pages use a back button.  
**Persistent status:** shop name, current user, online/offline status, and unsynced-change count when sync exists.

Design rules:

- [ ] Use readable text and strong contrast.
- [ ] Use large touch targets; aim for at least 44 × 44 CSS pixels for key controls.
- [ ] Keep checkout actions obvious and avoid tiny icons as the only labels.
- [ ] Use color plus text/icon for statuses; never communicate errors by color alone.
- [ ] Use confirmation dialogs for destructive or financial actions.
- [ ] Show loading, empty, offline, error, and success states for every important page.
- [ ] Provide undo only for safe actions; never silently erase completed financial records.
- [ ] Support keyboard navigation and barcode scanners that type into a focused input.

### Screen 1 — First-run setup

Fields: shop name, logo (optional), currency, language, timezone, receipt header/footer, tax settings, first admin account, and backup location instructions.

Acceptance criteria:
- [ ] A first-time user can create a local shop without internet after app assets are installed.
- [ ] Currency and locale can be changed later without corrupting historic sales.
- [ ] Setup explains that clearing browser/app storage can erase local data unless a backup exists.

### Screen 2 — Dashboard

Layout:
- Header: shop name, date range, online/offline indicator, current user.
- Summary cards: sales today, transaction count, gross-profit estimate, low-stock count.
- Primary actions: **New Sale**, **Add Product**, **Receive Stock**, **Close Cash Session**.
- Lower panels: recent sales, low-stock list, top-selling products.

Acceptance criteria:
- [ ] All totals are calculated from stored records, not manually maintained counters.
- [ ] The dashboard still works offline.
- [ ] Reports clearly label profit as an estimate until costing and expense rules are finalized.

### Screen 3 — POS / New Sale

Tablet design:
- Left/upper area: barcode/search field, category filters, product grid/list.
- Right/bottom area: cart with item, quantity, unit price, line discount, and total.
- Checkout area: subtotal, discounts, configurable tax, grand total, payment method, amount tendered, change, and **Complete Sale**.

Behavior:
- [ ] Search by name, SKU, or barcode.
- [ ] A hardware scanner can scan into the focused search field.
- [ ] Camera scanning is an optional path, not the only barcode workflow.
- [ ] Validate stock before finalizing.
- [ ] A single database transaction records the sale, sale items, payment, and stock movement.
- [ ] Disable repeat checkout while the transaction is processing.
- [ ] If checkout fails, show a clear error and do not create half a sale.
- [ ] Generate a unique sale number; never reuse a number after a failed or voided sale.
- [ ] Completed sales cannot be casually edited; use a void/refund workflow with an audit record.
- [ ] Show a receipt preview and support reprinting without creating a second sale.

### Screen 4 — Products

Views: searchable table/list, product detail, create/edit form, archived products.

Fields:
- Product name, category, SKU, barcode(s), description (optional)
- Cost and selling price
- Reorder threshold
- Stock by location (future)
- Unit of measure
- Variants such as color/capacity (if needed)
- Serial/IMEI tracking and warranty fields (optional feature)
- Active/archive status

Rules:
- [ ] Prefer archiving instead of deleting a product with sales history.
- [ ] A barcode should identify the intended sellable item/variant unambiguously.
- [ ] Price changes affect future sales only; historic sale lines keep their price snapshot.
- [ ] Stock changes are made through stock movements, not by silently editing a number.

### Screen 5 — Inventory

Panels: current stock, low-stock items, stock movement history, receive stock, stock count, adjustment.

Each movement records: product, quantity delta, reason, linked sale/purchase if relevant, user/device, timestamp, and unique ID.

Rules:
- [ ] Receiving stock increases inventory.
- [ ] A completed sale decreases inventory.
- [ ] A refund increases stock only if the returned item is marked resellable.
- [ ] Damaged/lost items use explicit adjustment reasons.
- [ ] Never erase a movement to fix an error; create a reversing/corrective movement.
- [ ] Reconcile the displayed quantity from movements or rigorously maintain it transactionally.

### Screen 6 — Purchases and suppliers

- [ ] Create supplier record with name and contact fields.
- [ ] Record purchase receipt, item quantities, unit cost, and date.
- [ ] Add stock only when goods are received, not merely when an order is drafted.
- [ ] Keep the supplier and item cost snapshots on the purchase.
- [ ] Support purchase returns as linked reversing records (later if not MVP).

### Screen 7 — Sales history and refunds

Filters: date, sale number, cashier, payment method, status, customer (if enabled).

- [ ] Open a sale to see line items, discounts, payments, receipt, and associated stock movements.
- [ ] Refund individual items or the whole sale with a reason.
- [ ] Record refund amount and refund payment method separately.
- [ ] Prevent refunding more quantity/value than was sold/refunded already.
- [ ] Retain the original sale and a full audit trail.

### Screen 8 — Expenses and cash sessions

Expense fields: category, amount, date/time, payment method, note, creator.

Cash-session fields: opening float, cash sales, cash refunds, cash in/out, closing counted amount, expected amount, difference, opened/closed by.

- [ ] Do not mix sales revenue with cash currently in the drawer.
- [ ] Closing a session saves a record; later corrections require an audited adjustment.
- [ ] Profit reporting subtracts expense records according to the explicitly chosen rules.

### Screen 9 — Reports

MVP reports:
- [ ] Sales by day/week/month and custom date range
- [ ] Product sales and quantities sold
- [ ] Gross-profit estimate by sale/product
- [ ] Inventory on hand and low-stock list
- [ ] Stock movements and adjustments
- [ ] Returns/refunds
- [ ] Expenses by category
- [ ] Payment-method totals
- [ ] CSV export

Report rules:
- [ ] Use the sale-time cost snapshot for historic gross-profit calculations.
- [ ] Document the inventory-cost method before trusting profit reports.
- [ ] Clarify whether discounts, tax, refunds, and expenses are included in each metric.
- [ ] Use consistent date/timezone boundaries.

### Screen 10 — Settings, users, backup, and synchronization

- [ ] Shop profile, logo, receipt template, currency, language, tax settings.
- [ ] User list, roles, deactivate user, reset access.
- [ ] Device registration and last-backup/sync information where applicable.
- [ ] Export backup, restore backup, and verify backup integrity.
- [ ] Show app version and data schema version.
- [ ] Explain updates and warn before incompatible schema changes.

---

## 5. Technical architecture

### Preferred evaluation route: customize Olgax if it passes the audit

Follow the repository's actual architecture and do not replace its database/sync approach without a clear reason. Add mobile-shop-specific fields and workflows through migrations, tests, and isolated modules.

### Build-from-scratch fallback

- **UI:** React + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS and accessible reusable components
- **PWA/offline assets:** `vite-plugin-pwa` / Workbox
- **Local database:** Dexie.js over IndexedDB
- **Validation:** Zod
- **Forms:** React Hook Form
- **Barcode camera:** `@zxing/browser`; test it on the actual tablet and browser
- **Charts:** a maintained chart library only when reports need it
- **Tests:** Vitest for unit/integration tests; Playwright for end-to-end workflows
- **Backend when needed:** PostgreSQL plus a secured API and authentication provider

### Architecture sketch

```text
Android tablet / browser-installed PWA
  ├── React UI
  ├── Domain services (checkout, refunds, stock, reports)
  ├── Local database (IndexedDB through Dexie)
  ├── Service worker (cache application files)
  ├── Export/restore backup
  └── Pending-sync queue (later phase)
              │ internet available
              ▼
        Secured sync/API layer
              │
              ▼
       PostgreSQL backend
  ├── tenant and user permissions
  ├── catalog / transactions / audit
  ├── idempotent sync processing
  └── cloud backup / admin functions
```

**Important distinction:** GitHub stores code. GitHub Pages can host static application files; it is not a transactional database or secure backend. An offline app's local records must be stored on the device, and multi-shop cloud data needs a separate backend.

### Suggested code boundaries

```text
src/
  app/                 routing, app shell, error boundaries
  components/          shared UI components
  features/
    dashboard/
    pos/
    products/
    inventory/
    purchases/
    sales/
    refunds/
    customers/
    suppliers/
    expenses/
    reports/
    settings/
  domain/              business rules and shared types
  db/                  local schema, migrations, repositories
  sync/                queued operations, retry, conflict UI (later)
  services/             barcode, receipt, backup, export
  i18n/                 language and RTL support if required
  tests/
```

Keep pricing, stock changes, refunds, and profit calculations out of visual components. Put business logic in tested domain services.

---

## 6. Data model — initial design

Use stable UUID-style identifiers so records created offline can later sync without waiting for a server-generated integer ID. Store `shop_id`/`tenant_id` on all shop-owned records from the beginning.

Core tables/entities:

- `shops`: tenant/account, business settings, subscription/plan status if needed.
- `stores`: physical branches; MVP can have one.
- `users`: account identity and role memberships.
- `devices`: registered installation/device ID, label, last sync, app version.
- `products`: name, SKU, category, unit, active/archive state, reorder threshold.
- `product_barcodes`: barcode values linked to the precise product or variant.
- `categories`: product grouping.
- `suppliers`: supplier details.
- `customers`: optional customer details; collect only what is needed.
- `sales`: sale number, status, cashier, timestamps, currency, subtotal, discount, tax, grand total.
- `sale_items`: product ID plus snapshots of name/SKU, quantity, unit price, discount, unit cost, and line total at sale time.
- `payments`: sale/refund link, method, amount, reference/status if relevant.
- `refunds`: original sale, reason, amount, processed by, timestamp.
- `stock_movements`: product, signed quantity delta, reason/type, source record, user/device, timestamp.
- `purchases` and `purchase_items`: supplier, received status/date, quantities and cost snapshots.
- `expenses`: category, amount, date, method, note, creator.
- `cash_sessions`: opening float, expected close, counted close, discrepancy.
- `audit_events`: actor/device, action, record type/ID, timestamp, reason, and relevant before/after summary.
- `sync_operations`: unique operation ID, tenant/device, entity, version, status, retry count, and error details (only if cloud sync is implemented).

### Data integrity rules

- Store money in integer minor units where possible; never use floating-point arithmetic for financial totals. Configure currency precision rather than assuming all currencies behave alike.
- Keep currency code and relevant settings with historic transactions.
- Use database transactions for checkout, refund, and receiving stock.
- Make sync requests idempotent: retrying the same operation must not create a second sale.
- Do not permanently delete completed sales, payments, refunds, or stock movements.
- Validate quantity, discount, amount paid, and refund limits in the domain layer and again on the server.
- Keep a schema version and implement explicit migrations.
- Minimize customer information and document what is collected and why.

### Inventory costing decision

Before releasing profit reports, choose and document a costing policy, such as weighted-average cost or FIFO, and check it against local accounting/tax advice. Regardless of the method, preserve the unit-cost snapshot used for each sale so old reports do not silently change whenever purchase prices change.

---

## 7. Offline and synchronization rules

### MVP single-device offline behavior

- [ ] Cache all essential application assets through the service worker.
- [ ] Store products, sales, stock movements, settings, and reports locally.
- [ ] Make checkout entirely local; do not wait for a cloud API.
- [ ] Show an unmistakable offline indicator.
- [ ] Keep local data after reload and browser restart.
- [ ] Add export/restore backups before the first real customer uses it.
- [ ] Test after turning airplane mode on, closing the PWA, and reopening it.
- [ ] Test data persistence under low storage and normal app updates.

### Multi-device synchronization — later phase

- [ ] Assign every device a stable ID and every write a unique operation ID.
- [ ] Queue local writes durably; retry safely with backoff when online.
- [ ] Use tenant checks on the server for every read and write.
- [ ] Track sync state per operation and display failures to the shop admin.
- [ ] Use server acknowledgements and idempotency so retries do not duplicate transactions.
- [ ] Create a conflict queue and an admin review screen for unresolvable conflicts.
- [ ] Test simultaneous edits, duplicate delivery, out-of-order delivery, expired sessions, and server outages.

**Inventory warning:** two independent devices can each sell the last unit while disconnected. No sync technology can know about the other sale until they reconnect. For the first commercial version, use one checkout device per shop, a shared local server/network, or a clearly documented oversell-conflict policy. Do not promise strict stock accuracy across multiple disconnected tills without a design that actually guarantees it.

---

## 8. Security and commercial readiness

- [ ] Enforce server-side tenant and role checks; hiding a button in the UI is not security.
- [ ] Keep secret keys and privileged server credentials out of frontend code and GitHub.
- [ ] Use least-privilege roles: owner/admin, manager, cashier.
- [ ] Cashiers cannot alter old sale prices, erase audit history, or manage owner access.
- [ ] Require a reason for voids, refunds, and stock adjustments.
- [ ] Do not log passwords, tokens, or unnecessary personal data.
- [ ] Protect local data from casual access and document limits of browser-based local storage.
- [ ] Test backup restoration, not just backup export.
- [ ] Add dependency/security scanning and keep dependencies updated deliberately.
- [ ] Publish a privacy policy, support contact, update policy, backup instructions, and a simple service agreement before commercial deployment.
- [ ] Have an appropriate adult/business adviser review customer contracts, payment handling, data protection, licensing, and local tax/accounting obligations before selling to real shops.

This is software-engineering guidance, not legal or accounting advice. Licensing and regulatory obligations depend on the exact code, distribution method, business model, and jurisdiction.

---

## 9. Open-source resources

### Candidate POS projects

1. **Olgax POS** — https://github.com/OLGAX-com/olgax-pos  
   Closest architectural match to an offline-capable PWA with a synchronization path. MIT license according to its repository; audit because it is an early MVP.

2. **Open Source Point of Sale** — https://github.com/opensourcepos/opensourcepos  
   Useful catalog of conventional POS features. PHP + MySQL/MariaDB. Its license page requires the project attribution footer to remain visible and unmodified; read the whole license before reuse.

3. **Posnic** — https://github.com/Posnic/POS  
   Offline-first retail POS reference. Its source is AGPL-3.0-only; bundled components can have their own licenses. Review package notices carefully before redistribution or network deployment.

4. **Open POS** — https://github.com/sinecordproductions/OPEN-POS_Free-SmartPOS-Software  
   Local Python desktop POS reference with backup/restore documentation; a different deployment model from a browser PWA.

### Development libraries and documentation

- React with TypeScript: https://react.dev/learn/typescript
- Tailwind CSS with Vite: https://tailwindcss.com/docs/installation/using-vite
- PWA plugin for Vite: https://github.com/vite-pwa/docs
- Dexie.js / IndexedDB: https://dexie.org/docs
- Barcode scanning in a browser: https://github.com/zxing-js/browser
- Vitest: https://vitest.dev/guide/
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- GitHub Codespaces: https://github.com/features/codespaces
- OWASP Application Security Verification Standard: https://owasp.org/projects/asvs
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

### Licenses to understand

- **MIT:** generally permissive for commercial use but requires preserving relevant copyright/license notices.
- **AGPL:** has source-sharing obligations for covered modified versions, including certain network-use cases; do not assume a proprietary derivative is permitted without compliance.
- **Dependencies:** check every package, font, icon set, and copied asset. Maintain a `THIRD_PARTY_NOTICES.md` file and record the license and version for each dependency.

Never remove another project's attribution or claim ownership of code you did not write. If building on a repository, preserve required notices and follow its exact license terms.

---

## 10. Tablet-based development workflow

You can use a browser-based cloud development environment from the tablet. GitHub Codespaces runs a development environment in the cloud and is accessible through a browser; check its current included usage quota and billing before using it regularly.

- [ ] Create a private GitHub repository for development.
- [ ] Create a `README.md`, this roadmap, and a `LICENSE` only after deciding your own project's licensing strategy.
- [ ] Use feature branches, for example `feature/pos-checkout` and `feature/inventory`.
- [ ] Make small changes and commit them often.
- [ ] Keep secrets in environment variables and ignore local `.env` files.
- [ ] Use issues and a GitHub Project board with columns: Backlog, Ready, In Progress, Review/Test, Done.
- [ ] Add labels: `feature`, `bug`, `offline`, `data-integrity`, `security`, `design`, `sync`, `documentation`.
- [ ] Test preview builds on the tablet itself, not only in the code editor preview.
- [ ] Keep a test shop with fake products; never debug against a customer's only live dataset.

GitHub Pages is suitable for static app files and demos. It is not a backend/database. Do not put private customer data, API secrets, or real sales records in a public repository.

---

## 11. Delivery phases and definition of done

### Phase 0 — Product research

- [ ] Write down the real shop's daily workflow from opening to closing.
- [ ] Ask a shop owner/cashier what products, stock adjustments, returns, receipt, and expense rules they need.
- [ ] List required hardware: tablet, scanner, receipt printer, cash drawer.
- [ ] Select the first payment methods and currency/localization needs.
- [ ] Decide whether MVP is one device or multiple devices.
- [ ] Review Olgax and choose fork vs new build.

**Done when:** scope is written, assumptions are explicit, and the starting codebase is chosen for evidence-based reasons.

### Phase 1 — Prototype the screens

- [ ] Build navigation and a reusable design system.
- [ ] Create static prototypes for dashboard, products, POS, stock, sales history, reports, and settings.
- [ ] Add empty, loading, error, success, and offline states.
- [ ] Test the flows with someone who has not seen the app before.

**Done when:** a tester can find a product, sell it, see the stock decrease, and find the receipt without guidance.

### Phase 2 — Data foundations

- [ ] Define entities, IDs, relationships, indexes, and schema versioning.
- [ ] Implement database migrations.
- [ ] Implement products/categories/barcodes.
- [ ] Implement stock movements and audit events.
- [ ] Add test fixtures with believable sample data.

**Done when:** records persist after reload and all stock changes have a traceable cause.

### Phase 3 — Checkout and financial integrity

- [ ] Implement cart, quantity changes, discounts, and totals.
- [ ] Implement payment recording.
- [ ] Implement atomic sale creation and stock deduction.
- [ ] Implement sale detail, receipt generation, and receipt reprint.
- [ ] Implement void/refund rules and corrective stock movements.
- [ ] Test duplicate clicks and interrupted checkout.

**Done when:** a sale is either fully recorded or not recorded; retries never duplicate a sale; stock and sale totals reconcile.

### Phase 4 — Inventory and operations

- [ ] Implement stock receiving and adjustments.
- [ ] Implement suppliers and purchases.
- [ ] Implement expenses and cash sessions.
- [ ] Implement low-stock alerts and basic reports.
- [ ] Implement CSV export/import with validation.

**Done when:** a test shop can run a simulated day from stock intake to checkout and closing report.

### Phase 5 — Offline and backup

- [ ] Cache the app shell and required assets.
- [ ] Test full workflow in airplane mode.
- [ ] Add encrypted or otherwise protected backup storage if appropriate to the selected platform and threat model.
- [ ] Implement backup export and version-aware restore.
- [ ] Test restoring to a fresh installation and reconcile record counts/totals.

**Done when:** the app can reopen offline, complete sales offline, and recover data from a tested backup.

### Phase 6 — Security and quality

- [ ] Implement roles and permission checks.
- [ ] Run automated unit and end-to-end tests.
- [ ] Test invalid inputs, zero/negative quantities, excessive discounts, duplicate barcodes, and over-refunds.
- [ ] Test low storage, app update, browser restart, and session expiry.
- [ ] Review dependencies and licensing.
- [ ] Fix all critical data-loss, checkout, tenant-isolation, and authentication bugs.

**Done when:** the acceptance-test checklist passes on the actual tablet and a backup restore has been demonstrated.

### Phase 7 — First shop pilot

- [ ] Use fake data first; do not make it the only ledger immediately.
- [ ] Run the new system alongside the current manual process for an agreed trial period.
- [ ] Compare daily sales, cash totals, stock changes, refunds, and backup results.
- [ ] Record every bug and edge case.
- [ ] Confirm staff can use it without developer help.
- [ ] Agree on data ownership, support expectations, and recovery process before relying on it.

**Done when:** the pilot produces matching totals for the chosen test period, errors have been corrected, and the shop can restore its own data.

### Phase 8 — Commercial release

- [ ] Create a repeatable installation/onboarding procedure.
- [ ] Create a demo shop and user guide.
- [ ] Publish support, update, privacy, backup, and license information.
- [ ] Make a feature/bug request process.
- [ ] Keep a tested release build separate from development.
- [ ] Maintain release notes and a rollback/recovery procedure.
- [ ] Add multi-device sync only when the single-device version is dependable.

**Done when:** another shop can be onboarded consistently, its data is isolated, backups can be restored, and support boundaries are documented.

---

## 12. Acceptance-test checklist

Before commercial use, manually and automatically test:

- [ ] Add/edit/archive a product and preserve its history.
- [ ] Two products cannot accidentally share a conflicting barcode.
- [ ] Complete a cash sale and verify total, payment, receipt, and stock deduction.
- [ ] Tap Complete Sale repeatedly and verify that only one sale is recorded.
- [ ] Restart the app during/after checkout and verify consistency.
- [ ] Try to sell more stock than is available and verify the chosen policy.
- [ ] Process a partial refund and verify refund limits and stock-restock choice.
- [ ] Receive stock and verify quantity/cost history.
- [ ] Create an adjustment with a required reason.
- [ ] Record an expense and verify report definitions.
- [ ] Turn on airplane mode, restart the app, and complete a sale.
- [ ] Export a backup, clear a test installation, restore, and compare totals.
- [ ] Verify a cashier cannot use admin-only functions.
- [ ] When sync exists: deliver the same queued operation twice, send operations out of order, and simulate server rejection.
- [ ] When multi-tenant support exists: test that a user from Shop A cannot read or mutate Shop B's data.

---

## 13. Business model and customer rollout

A sensible early model is:

1. **Setup fee:** configuration, product import, device/printer setup, and staff training.
2. **Customization fee:** shop-specific reports, receipt design, and workflows.
3. **Support/maintenance:** updates, backups, and help, with clearly defined scope.
4. **Optional hosted features:** remote sync and cloud backups, only after they are reliable and their ongoing costs are understood.

Do not promise “lifetime support,” perfect data recovery, or unlimited customizations for a one-time fee. Document what is included, who owns exported data, how backups work, and what happens if the service stops.

Start with one pilot shop, learn from actual usage, and use that evidence to determine which features deserve priority. Do not add every possible feature before the core checkout and stock workflows are reliable.

---

## 14. First ten actions

1. [ ] Open the Olgax POS repository and read its architecture and license.
2. [ ] Create a private notes document for findings, risks, and missing features.
3. [ ] Decide the first target: one shop, one device, fully offline MVP.
4. [ ] Write a short requirements list with a shop owner or someone who understands daily retail workflows.
5. [ ] Draft the dashboard, product list, product form, POS, sales history, and inventory screens.
6. [ ] Create the GitHub repository and issue board.
7. [ ] Make a small prototype with sample products and no real financial data.
8. [ ] Implement product storage and migrations before checkout complexity.
9. [ ] Implement checkout as an atomic transaction and write tests immediately.
10. [ ] Do not pilot with real records until offline behavior, data export, restore, and refund tests pass.

**Primary milestone:** one reliable sale can be recorded offline, the right stock is deducted, the receipt can be reopened, and a tested backup can restore the data.
