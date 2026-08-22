# Legacy — local API tunnel (optional)

Production no longer needs this. API + Postgres run on Railway:

- API: https://api-production-8d38.up.railway.app
- Frontend: https://madina-plus.ramighassan-d.workers.dev

Use this file only if you temporarily expose a **local** API again.

## Old Path B pieces

- Postgres: localhost:5432
- API: http://127.0.0.1:5088
- Tunnel: `systemctl --user status cloudflared-api-quick`

## Restart helpers (local only)

```bash
systemctl --user restart cloudflared-api-quick
cd backend/src/MadinahPlus.Api && ASPNETCORE_URLS=http://127.0.0.1:5088 dotnet run
```
