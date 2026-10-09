# Installments

Track purchases paid in monthly installments and see what you pay each month. It is a Progressive Web App: install it on your phone, use it offline, and keep your data only on your device.

## Features

- **Purchases** (home): the total to pay in the month, the change against the previous month and the next three months on top; below, every purchase with its progress (one segment per payment), what is paid and what is left. Filter by current, finished or all, by tag, or by text.
- **Projection**: monthly totals for the next 12 months, when the last payment is, and which purchases you pay in each month.
- **Statistics**: what is still to pay and how much of it is paid, the monthly average and the highest month over the next 12 months, total bought, purchases paid off, purchases ending in the next 3 months (and how much they free up per month), and the month's payments by tag.
- **Add and edit**: description, total amount, purchase date, number of payments and tags. A preview shows the payment amount and the first and last months. Deleting asks for a second tap and can be undone.
- **Settings**: light, dark or system theme; display currency; JSON backup export and import, CSV export, copy backup to the clipboard, and delete everything (with undo).

### How payments are counted

The purchase month is payment 0: nothing is charged. Payment 1 is the next month. The total is split evenly in cents, and any leftover cents go into the last payment.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript (strict)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) (Workbox) for the manifest and the offline service worker
- [Vitest](https://vitest.dev) for unit tests
- [oxlint](https://oxc.rs) and [Prettier](https://prettier.io)
- Schibsted Grotesk font, self-hosted with [Fontsource](https://fontsource.org)

There is no backend. Data is saved in `localStorage` under the key `installments-tracker.v1`.

## Scripts

| Command                       | What it does                                    |
| ----------------------------- | ----------------------------------------------- |
| `npm run dev`                 | Start the dev server                            |
| `npm run build`               | Type-check and build to `dist/`                 |
| `npm run preview`             | Serve the build locally                         |
| `npm test`                    | Run the unit tests once (`test:watch` to watch) |
| `npm run lint`                | Lint with oxlint                                |
| `npm run typecheck`           | Type-check only                                 |
| `npm run format`              | Format every file with Prettier                 |
| `npm run format:check`        | Check formatting (used in CI)                   |
| `npm run generate-pwa-assets` | Make the PWA icons from `public/favicon.svg`    |

Needs Node 22 or newer (see `.nvmrc`).

## Structure

```text
src/
├── app/            # App shell, providers and the sheet outlet
├── components/
│   ├── layout/     # Header (month switcher) and bottom navigation
│   └── ui/         # Icon, BottomSheet, Toast, Segments, Money, ConfirmButton, EmptyState
├── constants/      # Icons, currencies, locale, theme colors
├── context/
│   ├── installments/  # Data store: reducer, provider, actions (persisted)
│   ├── toast/         # Toast messages with an optional Undo action
│   └── ui/            # Active view, browsed month, filters, open sheet
├── features/
│   ├── purchases/   # Month header, purchase list, filters and the add/edit sheet
│   ├── projection/  # 12-month projection
│   ├── statistics/  # Statistics view
│   └── settings/    # Settings and the import sheets
├── hooks/          # useMoney, useDocumentTheme, useDelayedFocus
├── services/       # Pure logic: schedule, month summary, filters, projection, statistics, backup, storage
├── styles/         # Design tokens and global styles
├── test/           # Test factories
├── types/          # Domain and UI types
└── utils/          # Dates, months, numbers, money format, CSV, download, clipboard
```

All calculations live in `services/` as pure functions, next to their tests.

## Deploy to GitHub Pages

1. Create a GitHub repository (for example `installments`) and push `main`:

   ```bash
   git remote add origin git@github.com:<user>/installments.git
   git push -u origin main
   ```

2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Each push to `main` runs `.github/workflows/deploy.yml`: lint, format check, tests, build, deploy. The site is published at `https://<user>.github.io/installments/`.

The workflow sets `BASE_PATH` from the Pages configuration, so it also works with a custom domain. To try a Pages build locally:

```bash
BASE_PATH=/installments/ npm run build
npx vite preview --base /installments/
```

## Move your data from the old HTML version

The new app cannot read the old version's storage, so move the data with a backup file:

1. In the old version, open **Settings** and tap **Export backup (JSON)**. If the download does not work there, tap **Copy backup to clipboard** and paste the text into a file named `backup.json`.
2. In this app, open **Settings → Import backup → Choose file** and pick that file.
3. Choose **Replace all my purchases** to get an exact copy (this also brings the currency), or **Add to my purchases** to merge.

The CSV export is a table for spreadsheets; it cannot be imported back.
