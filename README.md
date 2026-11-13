# University of Swat — Programme Directory & Website

A full-stack website for the **University of Swat** (uswat.edu.pk): the university's
programme catalogue plus its news, announcements, events, tenders and job
advertisements, served from MySQL through a REST API and rendered as a React SPA.

The catalogue is searchable and facetable — **53 programmes** across **12 degree
types**, **41 departments**, **6 faculties** and **2 campuses** — on a **green + red**
institutional identity built around the university's own crest colours.

---

## Stack

| Layer     | Technology                                                      |
| --------- | --------------------------------------------------------------- |
| Frontend  | React 18 (function components + hooks), React Router v6, Vite 5  |
| Styling   | Bootstrap 5 + custom CSS (one stylesheet per component)          |
| Backend   | Node.js + Express 4, REST/JSON                                   |
| Database  | MySQL 8 (`mysql2` connection pool, raw parameterised SQL)        |

No TypeScript, no ORM, no CSS framework beyond Bootstrap, no inline styles.

---

## Project structure

```
temp_20261112_01/
├── README.md
├── database/
│   ├── schema.sql              # MySQL 8 DDL (10 tables, FKs, fulltext index)
│   └── seed.sql                # programmes, faculties, editorial content
├── server/                     # Express REST API
│   ├── package.json
│   ├── .env.example
│   ├── server.js               # boot: env → DB check → listen
│   └── src/
│       ├── app.js              # express app + middleware
│       ├── config/             # env.js, db.js (mysql2 pool)
│       ├── middleware/         # asyncHandler, errorHandler, notFound
│       ├── routes/             # index, programs, content, site, meta
│       ├── controllers/        # programs, content, site, meta
│       ├── services/           # programs / content / site — all SQL lives here
│       └── utils/              # httpError, pagination, programMapper
└── client/                     # React SPA (Vite)
    ├── package.json
    ├── vite.config.js          # dev proxy /api → localhost:5000
    ├── index.html
    ├── public/favicon.svg
    └── src/
        ├── main.jsx            # bootstrap CSS/JS + token layer
        ├── App.jsx             # routes
        ├── api/                # client.js, programsApi.js, siteApi.js
        ├── hooks/              # usePrograms, useProgram, useSite, …
        ├── utils/              # constants.js, format.js
        ├── styles/             # theme.css (tokens), global.css, buttons.css
        ├── components/
        │   ├── layout/         # SiteHeader (utility strip + nav), SiteFooter
        │   ├── common/         # DegreeBadge, KeywordPills, Pagination, states…
        │   ├── home/           # Hero, StatsBand, DegreeExplorer, LatestContent
        │   └── directory/      # SearchBar, FilterSidebar, ProgramCard, Toolbar
        └── pages/              # Home, Directory, ProgramDetail, content pages…
```

Every component sits next to its own `.css` file (`ProgramCard.jsx` +
`ProgramCard.css`).

---

## Prerequisites

- **Node.js 18+** and npm
- **MySQL 8** running locally (or reachable over the network)
- A MySQL account with permission to create a database

---

## Quick start

### 1. Create and seed the database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

`schema.sql` drops and recreates the `uswat` database, so re-running it is safe.
`seed.sql` truncates and reloads all data.

Verify:

```sql
USE uswat;
SELECT COUNT(*) FROM programs;       -- 53
SELECT COUNT(*) FROM content_items;  -- 68
```

### 2. Start the API

```bash
cd server
cp .env.example .env        # then edit DB_PASSWORD etc.
npm install
npm run dev                 # http://localhost:5000
```

Check it is alive: <http://localhost:5000/api/health> should report
`{"status":"ok","database":"connected"}`.

### 3. Start the client

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open <http://localhost:5173>. The Vite dev server proxies `/api/*` to
`http://localhost:5000`, so no CORS setup is needed in development.

### Production build

```bash
cd client && npm run build      # emits client/dist
cd ../server && npm start       # serves the API on PORT
```

Serve `client/dist` from any static host (or a reverse proxy) and set
`VITE_API_BASE_URL` at build time if the API lives on a different origin.

---

## Client routes

| Route                | Page                                                        |
| -------------------- | ----------------------------------------------------------- |
| `/`                  | Home — hero, published counters, programmes, VC message      |
| `/programs`          | Programme directory (search, facets, sort, pagination)       |
| `/programs/:slug`    | Programme detail + related programmes                        |
| `/news`              | Latest News                                                  |
| `/announcements`     | Announcements                                                |
| `/events`            | Events                                                       |
| `/tenders`           | Tender                                                       |
| `/jobs`              | Jobs Advertisement                                           |
| `/about`             | About University                                             |
| `/vice-chancellor`   | Vice Chancellor's Message                                    |
| `/faculties`         | Faculties and their departments                              |
| `/campuses`          | Campuses                                                     |
| `/contact`           | Contact and administration                                   |
| `*`                  | 404                                                          |

---

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint            | Purpose                                              |
| ------ | ------------------- | ----------------------------------------------------- |
| GET    | `/health`           | Liveness + database connectivity                      |
| GET    | `/stats`            | Headline counters + totals + programmes by level       |
| GET    | `/programs`         | Search, filter, sort and paginate the directory        |
| GET    | `/programs/filters` | Option lists for the filter sidebar (with counts)      |
| GET    | `/programs/:slug`   | Programme detail, keywords and related programmes      |
| GET    | `/content`          | News / announcements / events / tenders / jobs         |
| GET    | `/content/:slug`    | One editorial item                                     |
| GET    | `/pages`            | Index of long-form pages                               |
| GET    | `/pages/:slug`      | One long-form page (About, VC message)                 |
| GET    | `/campuses`         | Campuses with department and programme counts          |
| GET    | `/faculties`        | Faculties with their departments nested                |

`GET /programs` query parameters:

| Parameter    | Type                | Notes                                                                 |
| ------------ | ------------------- | --------------------------------------------------------------------- |
| `search`     | string              | Matches title, overview, description, department, faculty, keyword      |
| `degree`     | string (repeatable) | Degree code, e.g. `BS`; repeat or comma-separate                        |
| `level`      | string (repeatable) | `Undergraduate` \| `MS/MPhil` \| `Doctorate`                             |
| `faculty`    | string (repeatable) | Faculty slug                                                           |
| `department` | string (repeatable) | Department slug                                                        |
| `campus`     | string (repeatable) | Campus slug                                                            |
| `keyword`    | string (repeatable) | Keyword slug                                                           |
| `sort`       | enum                | `relevance` (default), `title`, `title_desc`, `degree`, `department`, `campus`, `newest` |
| `page`       | int                 | Default `1`                                                            |
| `limit`      | int                 | Default `9`, max `48`                                                  |

Response envelope:

```json
{
  "data": [ /* programme summaries */ ],
  "meta": { "page": 1, "limit": 9, "total": 53, "totalPages": 6, "hasNext": true, "hasPrev": false },
  "facets": {
    "levels":      [{ "value": "Undergraduate", "count": 38 }],
    "degreeTypes": [{ "code": "BS", "label": "Bachelor of Science", "level": "Undergraduate", "badgeKey": "green", "count": 31 }],
    "faculties":   [{ "name": "Faculty of Sciences", "slug": "faculty-of-sciences", "count": 21 }],
    "departments": [{ "name": "Department of Computer Science", "slug": "computer-science", "count": 2 }],
    "campuses":    [{ "name": "Main Campus", "slug": "main-campus", "count": 49 }],
    "keywords":    [{ "name": "Artificial Intelligence", "slug": "artificial-intelligence", "count": 3 }]
  }
}
```

Facets are **self-scoped**: selecting a degree type narrows the faculty and department
facets but leaves the degree-type facet intact, so a chosen value never collapses its own
list. Errors always use `{ "error": { "status": 404, "message": "Programme not found" } }`.

`GET /content` accepts `category` (`news` \| `announcement` \| `event` \| `tender` \| `job`),
`q`, `page` and `limit`, and additionally returns a `counts` object with a per-category
total: `{ "news": 20, "announcement": 12, "event": 12, "tender": 12, "job": 12, "all": 68 }`.

---

## Data provenance and accuracy

This is a **real institution's** website, so the data layer is deliberately honest about
where every fact came from.

- Programme, faculty, department, campus and degree-type records were transcribed from
  **uswat.edu.pk**. Every `programs` row carries a `source_url` pointing at the university
  page it came from, and the programme detail page links back to it.
- Editorial content in `content_items` is the university's own published news,
  announcements, events, tenders and job advertisements, each with its real publication
  date and a `url` back to the original post on uswat.edu.pk.
- Fields the university does not publish were left **blank** rather than filled with
  plausible-looking values. The UI omits an element when its value is missing, so an
  absent detail is visible as an absent detail, never as an invented one.
- Three tables that a demo dataset would normally carry were **deliberately not created**:
  fabricated admission requirements, programme highlights and career outcomes. Inventing
  admission criteria or graduate outcomes for a real university would be misinformation.
- The six homepage counters (**Campuses 2, UG Programs 58, MS/MPhil Programs 19,
  Doctorate Programs 13, Faculty 152, Students 9,230**) are the university's own published
  figures, held in the `stats` table exactly as published.
- **Note the gap:** the university publishes 58 undergraduate, 19 MS/MPhil and 13
  doctorate programmes, while this directory catalogues 38, 9 and 6 respectively — the
  programmes that could be positively identified from the university's department pages.
  The counters describe what the university says it offers; the directory describes what
  was verifiable. The two are not reconciled, and no programme is invented to close the gap.
- Where the university shows a label but publishes no destination for it, the UI links to
  the university's own site search (`https://uswat.edu.pk/?s=…`) rather than to an
  invented page — see the `siteSearch()` helper in `client/src/utils/constants.js`.

Programme titles, departmental affiliations, published durations and source URLs are
transcribed; anything beyond that should be confirmed with the university.

---

## Design system

All colour decisions live in one file — [theme.css](client/src/styles/theme.css) — as CSS
custom properties. Nothing else hard-codes a hex value.

| Token               | Hex       | Used for                                          |
| ------------------- | --------- | ------------------------------------------------- |
| `--gp-green`        | `#1B5E20` | Header, footer, primary structure, default badges  |
| `--gp-green-accent` | `#2E7D32` | Hovers, links, accents                             |
| `--gp-green-light`  | `#E8F5E9` | Section tints, card washes                         |
| `--gp-green-dark`   | `#0F3D14` | Header utility strip, footer bottom strip          |
| `--gp-red`          | `#C62828` | CTAs, active nav rule, focus rings                 |
| `--gp-red-accent`   | `#E53935` | Red button hover                                   |
| `--gp-red-light`    | `#FDECEA` | Red-tinted callouts                                |
| `--gp-ink`          | `#1A1A1A` | Body text                                          |
| `--gp-paper`        | `#FFFFFF` | Card surfaces                                      |
| `--gp-off-white`    | `#F7F7F5` | Page background                                    |
| `--gp-border`       | `#E5E5E5` | Borders and dividers                               |
| `--gp-muted`        | `#6B6B6B` | Secondary text                                     |
| `--gp-tag-bg`       | `#F0EFED` | Keyword pill background                            |

Green carries the structure (header, footer, badges, tints); red carries the action
(primary buttons, the active nav underline). Degree badge colours come from the database
`degree_types.badge_key` column, so adding a degree type is a data change, not a code change.

Accessibility: semantic landmarks, skip link, labelled form controls, visible red focus
outlines, text alongside every colour signal, and `prefers-reduced-motion` support.

---

## Features

- **Search** across programme titles, overviews, descriptions, departments, faculties and keywords — debounced and URL-synced.
- **Faceted filtering** by level, degree type, faculty, department, campus and keyword — with live self-scoped counts.
- **Removable filter chips** and a one-click clear-all.
- **Seven sort orders**, all executed in SQL.
- **Shareable deep links**: filter, sort, search and page state all live in the query string.
- **Pagination** with a windowed page control.
- **Programme detail pages** with the department / faculty / campus it belongs to, the published duration, description, keywords, related programmes and a link to the source page.
- **Editorial sections** for news, announcements, events, tenders and jobs, each searchable and paginated, deep-linking to the original post.
- **Loading skeletons, empty and error states** with retry, plus a 404 page.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `database: "disconnected"` from `/api/health` | Check `server/.env` credentials and that MySQL is running. |
| Client shows an error state on the home page | Start the API on port 5000; confirm the `client/vite.config.js` proxy target. |
| `ER_NO_SUCH_TABLE` | Run `database/schema.sql` before `database/seed.sql`. |
| Deep links 404 in production | Configure your static host to rewrite unknown paths to `index.html`. |
| Port already in use | Change `PORT` in `server/.env` and the proxy target in `vite.config.js`. |
#   s w a t - U n i - 1  
 