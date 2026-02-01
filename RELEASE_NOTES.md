# Release Notes v0.7.0 (2026-02-01)

## 🚀 Major Features

### 1. Enhanced "Weekend-Day Exact Match" Forecast Tier
Introduced a new high-precision forecasting tier (Priority 1b) to fix inaccuracies in weekend predictions.
*   **Previous Behavior:** "Weekend" forecasts could mix data from any weekend day (e.g., Saturday predictions using Sunday data).
*   **New Behavior:**
    *   **Saturday** forecasts now *only* use historical data from past **Saturdays**.
    *   **Sunday** forecasts now *only* use historical data from past **Sundays**.
    *   **Friday** forecasts now *only* use historical data from past **Fridays**.
*   **Benefit:** Significantly improves forecast accuracy for weekend travelers by adhering to the specific traffic patterns of each day of the week.

## ⚡ Performance & Infrastructure

### 2. Railway Memory Optimization
Implemented critical optimizations to reduce memory usage and costs on Railway (~60-70% reduction).
*   **Docker Optimization:**
    *   Limited `uvicorn` to **1 worker** to prevent unnecessary memory consumption.
    *   Added `--limit-max-requests 1000` to prevent long-term memory leaks.
*   **Dedicated Scheduler Service:**
    *   Created `Dockerfile.scheduler`, a lightweight image specifically for the cron job service.
    *   Excluded heavy API dependencies (FastAPI, Uvicorn) from the scheduler to minimize footprint.

## 🛠️ Bug Fixes & Improvements

*   **Lynden Camera Thumbnail:** Updated the main page to prioritize the **"Aldergrove / Lynden - S"** (Southbound) camera as the primary thumbnail for better visibility.
*   **Tooltip Update:** Updated the frontend "Official Estimate" tooltip to correctly display "Updates every **15 mins**" instead of 5 mins.
*   **SOLID Refactoring:** Refactored the `generate_forecast_for_date` function, breaking it down from ~180 lines into clean, testable sub-functions (compliance with SOLID principles).
*   **Unit Tests:** Added extensive unit tests (`test_forecast_tiers.py`) covering all forecast tiers and the new weekend matching logic.

## 🧹 Maintenance

*   **Version Alignments:** Synced versions across `backend/app/main.py`, `frontend/package.json`, and `frontend/components/SiteFooter.tsx`.
