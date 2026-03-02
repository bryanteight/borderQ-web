# Release Notes v0.7.11 (2026-03-02)

## 🚀 New Features
- **Proactive Health Monitoring**: Added internal probes to the scheduler to independently check backend API health (every 5 min) and camera snapshot availability (every 15 min).
- **Discord Outage Alerts**: Automatic Discord notifications (with 30-60 min cooldowns) for API 5xx errors, container unreachability, and complete camera source failures at specific crossings.
- **Recovery Notifications**: Discord alerts automatically triggered when the API or cameras come back online.
- **Dynamic Frontend Checks**: Extended API probe to verify the 7-day `/forecast/...` Next.js frontend pages, ensuring SEO and routing are alive.

## 🐛 Bug Fixes
- None

## 🔧 Maintenance
- 12 new unit tests covering mocked HTTP responses, cooldown logic, failure thresholds, and recovery states for the health monitor service.

# Release Notes v0.7.10 (2026-02-21)

## 🚀 New Features
- **Region-Based Adaptive Polling**: Scheduler now tracks traffic independently per region (Cascadia, Detroit, Niagara). Only high-traffic regions poll at 5-min intervals — others stay at 15 min.
- **Region-Filtered Ingestion**: `ingest_border_data()` accepts an optional `regions` parameter to skip fetching data sources and processing ports for unaffected regions.
- **Region-Specific Discord Alerts**: High traffic alerts now name the exact region, triggering port, and wait time. Normalization alerts show which regions are still active.

## ⚡ Performance
- **Backend Memory Reduction (~100MB)**: Extracted lightweight cache-reading functions into `comparison_cache.py`, eliminating unnecessary DSPy/numpy loading at API startup. Backend memory should drop from ~220MB back to ~120MB.
- **Lazy Imports in Prediction Router**: Heavy forecast generation modules now load only when needed (cache miss), not at startup.

## 🐛 Bug Fixes
- fix: graceful degradation for Peace Bridge scraper (Sucuri WAF 403 is expected from Railway)
- fix: camera-official mismatch alert threshold lowered to 12 cars for earlier detection

## 🔧 Maintenance
- feat: add `region` field to Event model for region-gated UI
- refactor: independent 30-min cooldown timers per region in scheduler
- test: 8 new unit tests for region-based scheduler logic (activation, isolation, cooldown, intervals)
