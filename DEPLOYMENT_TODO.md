# Deployment & Optimization Tasks

- [x] Create deployment workflow documentation
    - [x] Create `.agent/workflows/deploy_to_railway.md`
- [x] Document Frontend + Backend Deployment
    - [x] Update `.agent/workflows/deploy_to_railway.md` to include multi-service setup
    - [x] Explain environment variable linking (API URL)
- [x] Fix Frontend Security Vulnerability
    - [x] Upgrade `next` version in `frontend/package.json`
    - [x] Push fix to GitHub
- [x] Verify Live Deployment
    - [x] Backend Online
    - [x] Frontend Online
    - [x] Link Frontend to Backend (`NEXT_PUBLIC_API_URL`)
    - [x] Remove debug code from Backend
- [x] Configure Custom Domain
    - [x] Connect `borderq.com` to Frontend
    - [x] (Optional) Connect `api.borderq.com` to Backend

## Tomorrow (Optimization)
- [ ] Enable Cloudflare Proxy (Orange Cloud) for `borderq.com`
- [ ] **CRITICAL:** Set Cloudflare SSL/TLS mode to "Full (Strict)"

## Analytics & Marketing
- [ ] Create Google Analytics 4 Property
- [ ] Get Measurement ID (starts with `G-`)
- [ ] Add `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX` to Railway Frontend Variables
