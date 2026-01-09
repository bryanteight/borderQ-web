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
## 01/02/2026 (v0.4.0 Smart Forecast Release)

### Post-Release Optimization & Roadmap
- [ ] **Data Ingestion & Accuracy**
    - [x] Ingest Seattle to Vancouver (Northbound) data to Qdrant DB.
    - [x] Bi-National Holiday Logic: Differentiate US vs CA holiday impacts (Southbound vs Northbound).
    - [ ] Improve CBSA Data Quality: Parse "Updated" timestamp from live scrape instead of "Now".
    - [ ] **Forecast Accuracy System**: Build tool to compare `forecast_points` vs real outcomes to tune the model.
- [ ] **Enhanced Inspection Detection (Anomaly Detection)**
    - [ ] **Method 1: Crawl Factor**: Research Google Maps Directions API integration to compare "Line Length" (Crawl duration) vs "Official Wait" (Processing duration).
    - [ ] **Method 2: Qdrant Anomaly**: Implement detection logic for "Inexplicable Delays" (Actual Wait > 3x Expected Wait during non-holiday/non-event times).
    - [ ] **Method 3: Keyword Listening**: Explore social media scraping for inspection-linked keywords (e.g., "Secondary", "Trunk check", "開後車廂").
    - [ ] **Schema Update**: Update `Event` and Qdrant payload to track `inspection_level` (Normal/Strict/Severe) and anomaly scores.
- [x] **Vector Engine (Qdrant) Optimization**
    - [x] **Cyclical Time Encoding**: Convert "Hour" and "Day" into Sine/Cosine pairs to fix the "Midnight Paradox."
    - [x] **Lag Features (Momentum)**: Store `Wait_Time_1hr_Ago` and `Wait_Time_2hr_Ago` in the vector to capture traffic trends.
    - [x] **Event Signals**: Implement an `Is_Major_Event` flag (Blue Jays games, concerts) to account for predictable traffic surges.
    - [ ] **Economic Signals**: Add `USD_CAD_Rate` to the vector to differentiate shopping traffic based on exchange rates.
    - [ ] **Weather Filtering**: Update `ingest.py` to only flag **Severe Weather** (Snow/Ice) and discard minor "noise" like light rain.
- [ ] **UX & AI Intelligence**
    - [ ] **Event-Aware Indicator (小光標)**: Dynamic UI/cursor that reacts to surges or severe weather.
    - [ ] **Dynamic Teaser Alerts**: Update `ForecastTeaser.tsx` to calculate "Wait X mins" from forecast dip.
    - [ ] **Unified Regional View**: Strategy for NB/SB pages (Separate routes vs. Tabbed toggle).
    - [ ] **AI for Northbound**: Enable LLM-generated insights/advice for return trips.
    - [ ] **AI RAG Optimization**: Research and evaluate **Hybrid Mode** (Semantic Routing + BM25 + Embedded Cosine Similarity) to improve retrieval precision and context relevance.
- [ ] **Refinement**
    - [ ] **Threshold Tuning**: Refine Red/Yellow trigger points for Teaser cards (10m rise / 15m savings).
    - [ ] **Weather-Aware Ratios**: Adjust forecasting multiplier based on live weather (e.g., Snow/Ice).
    - [ ] Implement smooth transition animations for card navigation.

### General Maintenance
- [ ] Investigate Latency Issue: Slow "Content Download" (~600ms) on `borderq.com`.
- [ ] Monitoring & Observability: API Monitoring Research.

