# Madinah+ / مدينة+

Vite + React web client and ASP.NET Core API for a student-friendly city certification prototype.

Demo data is fictional.

## Live (always on — PC can be off)

| Piece | URL |
| --- | --- |
| Frontend | https://madina-plus.ramighassan-d.workers.dev |
| API | https://api-production-8d38.up.railway.app |
| API health | https://api-production-8d38.up.railway.app/health |
| API Swagger | https://api-production-8d38.up.railway.app/swagger |

Hosted on **Cloudflare Workers** (frontend) + **Railway** (API + Postgres). No local tunnel required.

## Layout

```
backend/
  MadinahPlus.sln
  Dockerfile                   Railway / container image
  railway.toml
  src/MadinahPlus.Api          API (controllers, CORS, Swagger)
  src/MadinahPlus.Domain       Domain (entities, rules, services)
  src/MadinahPlus.DataAccess   EF Core, PostgreSQL, seed
frontend/                      Vite + React + Tailwind
deploy/                        Legacy local-tunnel notes (optional)
docker-compose.yml             Local PostgreSQL 16 only
wrangler.toml                  Cloudflare Workers (static SPA)
package.json                   Root scripts: build, deploy
```

## Production deploy

### Frontend (Cloudflare Workers)

Requires Node.js 22+ for Wrangler.

```bash
npm run deploy
```

`build:cf` bakes `VITE_API_URL=https://api-production-8d38.up.railway.app` into the SPA.

### Backend (Railway)

Project: [madinah-plus on Railway](https://railway.com/project/9e3e89dd-2a46-4c24-a01d-28d8782c651d)

```bash
cd backend
railway up -y -c --service api
```

Postgres is the Railway `Postgres` service. API reads `DATABASE_URL`.

## Local development (optional)

Requires .NET 8 SDK, Node.js 18+, and PostgreSQL.

```bash
docker compose up -d
cd backend && dotnet run --project src/MadinahPlus.Api
# other terminal:
npm run dev
```

- API: `http://localhost:5088`
- Site: `http://localhost:5173` (Vite proxies `/api` → `5088`)
- Override API: `VITE_API_URL=http://HOST:5088 npm run dev`

### Demo login

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@demo.com` | `Demo123!` |
| Municipality | `municipality@demo.com` | `Demo123!` |

## API

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/city` | City score and dimensions |
| GET | `/api/city/priorities` | Improvement priorities |
| GET | `/api/city/monitoring` | Before/after metrics |
| GET | `/api/housing` | Housing list |
| GET | `/api/housing/{id}` | Housing detail |
| PATCH | `/api/housing/{id}/inspection/{itemKey}` | Update criterion (`PASS` / `NEEDS` / `FAIL`) |
| POST | `/api/housing/{id}/improve` | Simulate re-inspection (all pass) |
| POST | `/api/housing/{id}/conditional` | Issue conditional certification |
| POST | `/api/housing/{id}/certify` | Issue full certification |
| GET | `/api/businesses` | Businesses |
| GET | `/api/routes` | Safe routes |
| GET | `/api/feedback` | Categories + recent notes |
| POST | `/api/feedback` | Submit feedback |

## Portals

- **Student:** city score, certified housing, businesses, safe routes, feedback
- **Municipality:** dashboard, housing inspections, certification seal, dimensions, monitoring
