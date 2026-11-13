# Graduate Programs API

Node.js + Express + MySQL backend for the **Graduate Programs Directory**.
Raw parameterised SQL via `mysql2` (connection pool, promise API) — no ORM.

## Tech stack

- Node.js (>= 18), CommonJS (`require`)
- Express 4
- mysql2 (connection pool, promise API, prepared statements)
- cors, dotenv, morgan

## Requirements

- Node.js >= 18
- MySQL 8

## Install

```bash
cd server
npm install
```

## Configure

Copy the example environment file and edit the values:

```bash
cp .env.example .env
```

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `5000` | HTTP port the API listens on |
| `NODE_ENV` | `development` | `development` logs stack traces; `production` hides them |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | `""` | MySQL password |
| `DB_NAME` | `graduate_programs` | Database name |
| `DB_CONNECTION_LIMIT` | `10` | Max pool connections |

> Missing variables fall back to the defaults above and a warning is logged.

## Create and seed the database

The schema lives one level up in the repo:

```bash
mysql -u root -p < ../database/schema.sql
mysql -u root -p graduate_programs < ../database/seed.sql
```

`schema.sql` creates and selects the `graduate_programs` database, so the second
command loads seed data into it.

## Run

Development (auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

On boot the server logs the database connection result and then starts listening.
If the database is unreachable the API still starts and `/api/health` reports
`"database": "disconnected"`.

## Response conventions

- Errors always use `{ "error": { "status": <int>, "message": "<string>" } }`.
- List responses are `{ "data": [...], "meta": {...}, "facets": {...} }`.
- Single-resource responses are `{ "data": { ... } }`.

Program **summaries** expose `keywords` as an **array of strings**; the program
**detail** exposes `keywords` as an **array of `{ name, slug }` objects**.

## Endpoints

### `GET /api/health`

```bash
curl http://localhost:5000/api/health
```

```json
{ "status": "ok", "database": "connected", "timestamp": "2026-11-12T08:00:00.000Z" }
```

### `GET /api/programs`

Directory listing with search, filters, sorting, pagination and facets.

| Query param | Type | Notes |
| --- | --- | --- |
| `search` | string | Matches title, overview, description, department, school, keyword name (`LIKE %term%`) |
| `degree` | string | Degree type `code`; repeatable or comma-separated |
| `department` | string | Department `slug`; repeatable or comma-separated |
| `school` | string | School `slug`; repeatable or comma-separated |
| `keyword` | string | Keyword `slug`; repeatable or comma-separated |
| `format` | string | `On campus` \| `Hybrid` \| `Online` |
| `stem` | `true` | Only STEM programs (applies only when exactly `true`) |
| `online` | `true` | Only online programs |
| `dual` | `true` | Only dual-degree programs |
| `sort` | string | `relevance` (default), `title`, `title_desc`, `deadline`, `degree`, `newest` |
| `page` | int | Default `1`, min `1` |
| `limit` | int | Default `9`, min `1`, max `48` |

Facets are computed against the current filters **except each facet's own
dimension**, so selecting `Ph.D.` narrows departments/keywords without collapsing
the degree-type facet.

```bash
curl "http://localhost:5000/api/programs?search=machine&degree=Ph.D.&format=On%20campus&sort=deadline&page=1&limit=9"
```

```json
{
  "data": [
    {
      "id": 1,
      "slug": "phd-computer-science",
      "title": "Ph.D. in Computer Science",
      "degreeType": "Ph.D.",
      "degreeTypeLabel": "Doctor of Philosophy",
      "badgeKey": "red",
      "department": "Computer Science",
      "departmentSlug": "computer-science",
      "school": "Department of Computer Science",
      "schoolSlug": "computer-science",
      "overview": "...",
      "duration": "5 years",
      "format": "On campus",
      "applicationDeadline": "December 15, 2026",
      "deadlineDate": "2026-12-15",
      "isDualDegree": false,
      "isOnline": false,
      "isStem": true,
      "keywords": ["Machine Learning", "Artificial Intelligence", "Robotics"]
    }
  ],
  "meta": { "page": 1, "limit": 9, "total": 100, "totalPages": 12, "hasNext": true, "hasPrev": false },
  "facets": {
    "degreeTypes": [{ "code": "Ph.D.", "label": "Doctor of Philosophy", "badgeKey": "red", "count": 42 }],
    "departments": [{ "name": "Computer Science", "slug": "computer-science", "count": 7 }],
    "schools": [{ "name": "Department of Computer Science", "slug": "computer-science", "count": 14 }],
    "formats": [{ "value": "On campus", "count": 80 }],
    "keywords": [{ "name": "Machine Learning", "slug": "machine-learning", "count": 9 }]
  }
}
```

### `GET /api/programs/filters`

Static-ish option lists joined with counts, for rendering the sidebar before any search.

```bash
curl http://localhost:5000/api/programs/filters
```

```json
{
  "data": {
    "degreeTypes": [{ "code": "Ph.D.", "label": "Doctor of Philosophy", "badgeKey": "red", "sortOrder": 1, "count": 42 }],
    "departments": [{ "name": "Computer Science", "slug": "computer-science", "schoolName": "Department of Computer Science", "schoolSlug": "computer-science", "count": 7 }],
    "schools": [{ "name": "Department of Computer Science", "slug": "computer-science", "count": 14 }],
    "keywords": [{ "name": "Machine Learning", "slug": "machine-learning", "count": 9 }],
    "formats": ["On campus", "Hybrid", "Online"]
  }
}
```

### `GET /api/programs/:slug`

Full program detail, including keyword objects, child collections, and up to three
related programs from the same department (descending) then school.

```bash
curl http://localhost:5000/api/programs/phd-computer-science
```

```json
{
  "data": {
    "id": 1,
    "slug": "phd-computer-science",
    "title": "Ph.D. in Computer Science",
    "degreeType": "Ph.D.",
    "degreeTypeLabel": "Doctor of Philosophy",
    "badgeKey": "red",
    "department": "Computer Science",
    "departmentSlug": "computer-science",
    "school": "Department of Computer Science",
    "schoolSlug": "computer-science",
    "overview": "...",
    "description": "...",
    "duration": "5 years",
    "credits": "12 courses",
    "format": "On campus",
    "location": "Providence, Rhode Island",
    "applicationDeadline": "December 15, 2026",
    "deadlineDate": "2026-12-15",
    "tuition": "USD 62,180 / year (full-time)",
    "websiteUrl": "https://...",
    "contactEmail": "cs-grad@example.edu",
    "isDualDegree": false,
    "isOnline": false,
    "isStem": true,
    "keywords": [{ "name": "Machine Learning", "slug": "machine-learning" }],
    "highlights": [{ "body": "..." }],
    "requirements": [{ "body": "..." }],
    "careers": [{ "title": "..." }],
    "related": [{ "id": 2, "slug": "...", "title": "...", "keywords": ["..."] }]
  }
}
```

Not found:

```json
{ "error": { "status": 404, "message": "Program not found" } }
```

### `GET /api/stats`

```bash
curl http://localhost:5000/api/stats
```

```json
{ "data": { "totalPrograms": 100, "totalDegreeTypes": 12, "totalDepartments": 26, "totalSchools": 8, "totalKeywords": 90 } }
```

## Project layout

```
server/
  server.js                     # bootstraps env, DB check, HTTP listener
  src/
    app.js                      # express app + middleware wiring
    config/                     # env loading, mysql pool
    controllers/                # request/response handling
    middleware/                 # asyncHandler, notFound, errorHandler
    routes/                     # /api route tree
    services/                   # SQL + business logic
    utils/                      # httpError, pagination, programMapper
```
