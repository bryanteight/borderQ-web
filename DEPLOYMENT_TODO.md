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

## 12/17/2025

### Optimization
- [x] Enable Cloudflare Proxy (Orange Cloud) for `borderq.com`
- [x] **CRITICAL:** Set Cloudflare SSL/TLS mode to "Full (Strict)"
- [] Investigate Latency Issue: Slow "Content Download" (~600ms) on `borderq.com`

### Analytics & Marketing
- [x] Create Google Analytics 4 Property
- [x] Get Measurement ID (starts with `G-`)
- [x] Add `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX` to Railway Frontend Variables

### Data Ingestion
- [x] Ingest and store Vancouver to Seattle data to Qdrant DB
- [ ] Ingest and store Seattle to Vancouver data to Qdrant DB
- [ ] Refactor `/stats/` pages to properly support Northbound (Seattle -> Vancouver) views. Currently hidden in `RegionalStatsPage`.
- [ ] Research & Implement Bi-National Holiday Logic:
    - [] Differentiate US Holidays (impacts NB traffic?) vs Canadian Holidays (impacts SB traffic?).
    - [ ] Update `context_enrichment.py` to tag events with country-specific holiday flags.
- [ ] Improve CBSA Data Quality: Parse the "Updated" timestamp from the live scrape instead of defaulting to "Now".
- [ ] Forecast Accuracy System: Build an internal tool to compare stored `forecast_points` against real outcomes to tune the Ratio/Decay model.

### UX Improvements
- [ ] Implement smooth transition animations when clicking cards to navigate to new pages
- [ ] Dynamic Teaser Alerts: Update `ForecastTeaser.tsx` to calculate "Wait X minutes" dynamically based on the forecast's lowest point (instead of hardcoded "40 mins").
- [ ] Weather-Aware Predictions: Adjust the forecasting ratio based on live weather conditions (e.g., higher multiplier during heavy snow).

(12/17/2025):

Optimization (Cloudflare + Latency Investigation)
Analytics & Marketing (GA4)
Data Ingestion (Vancouver → Seattle)
UX Improvements (Smooth Transitions)
Monitoring & Observability (API Monitoring Research) ← NEW
