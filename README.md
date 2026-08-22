# Madinah+ / مدينة+

Vite + React web client and ASP.NET Core API for the student-friendly city certification prototype.

Demo data is fictional.

## Layout

```
backend/
  MadinahPlus.sln
  src/MadinahPlus.Api          API layer (controllers, CORS, Swagger)
  src/MadinahPlus.Domain       Domain layer (entities, rules, services)
  src/MadinahPlus.DataAccess   Data access (EF Core, PostgreSQL, seed)
frontend/                      Vite + React web app
docker-compose.yml             PostgreSQL 16
```

## Backend

Requires .NET 8 SDK and PostgreSQL.

```bash
docker compose up -d
cd backend
dotnet run --project src/MadinahPlus.Api
```

API: `http://localhost:5088`  
Swagger: `http://localhost:5088/swagger`

Schema is created with `EnsureCreated` and seeded on first run. No EF migrations.

Connection string: `backend/src/MadinahPlus.Api/appsettings.json`

## Frontend

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Site: `http://localhost:5173`  
Vite proxies `/api` to `http://localhost:5088`.

Override API URL: `VITE_API_URL=http://HOST:5088 npm run dev`

Demo login:

- Student: `student@demo.com` / `Demo123!`
- Municipality: `municipality@demo.com` / `Demo123!`

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

Student: city score, certified housing, businesses, safe routes, feedback.  
Municipality: dashboard, housing inspections, certification seal, dimensions, monitoring.
