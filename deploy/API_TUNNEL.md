# Path B — API via Cloudflare quick tunnel

## Running pieces
- Postgres: localhost:5432
- API: http://127.0.0.1:5088
- Tunnel service: `systemctl --user status cloudflared-api-quick`
- Current API public URL: https://finish-grown-characters-concept.trycloudflare.com
- Frontend: https://madina-plus.ramighassan-d.workers.dev

## Keep PC awake
API + DB + cloudflared must stay running.

## If tunnel URL changes
1. `journalctl --user -u cloudflared-api-quick -n 50 --no-pager | grep trycloudflare`
2. Update `VITE_API_URL` inside root `package.json` script `build:cf`
3. Commit + push to GitHub (redeploys Workers)

## Restart helpers
```bash
systemctl --user restart cloudflared-api-quick
cd backend/src/MadinahPlus.Api && ASPNETCORE_URLS=http://127.0.0.1:5088 dotnet run
```
