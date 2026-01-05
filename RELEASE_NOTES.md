# Release Notes - v0.4.8 (Detail Page Refinement)

**Date:** January 5, 2026
**Versions:** Frontend v0.4.8 | Backend v0.4.8

This release brings significant improvements to the detail page user experience, solidifies the backend data pipeline, and refines the visual presentation of wait time forecasts.

## 🚀 Key Features

### 🖥️ Frontend (Web)
*   **Detail Page UX Overhaul**:
    *   **Dual Port Names**: Page titles now correctly reflect both US and Canadian designations (e.g., "Peace Arch / Douglas").
    *   **Prioritized Trends**: The "Typical Hourly Trend" chart has been promoted to the top of the page for instant visibility.
    *   **Cleaner Layout**: Removed generic analysis badges and static summaries to reduce clutter.
*   **Absolute Time Labels**: Forecast cards (sparklines) now display real-world timestamps (e.g., "10PM") instead of relative offsets.
*   **Northbound Clean State**: Explicitly hid misleading forecast sections for Northbound ports.

### ⚙️ Backend (API & Data)
*   **Robust Routing (Slug Refactor)**:
    *   Moved slug generation logic from the frontend to the backend for SEO-friendly URLs.
*   **Data Integrity**:
    *   **Chart Synchronization**: Fixed visual bugs in forecast charts.
    *   **Enhanced Deduplication**: Better detection of metadata changes.
*   **Stability**: Patched cronjob failures for empty batches.

---

# Release Notes - v0.4.0 (Smart Forecast)

## 🌟 Highlights

### 🧠 Smart Traffic Forecasts (Northbound)
We've introduced a new **Adaptive Intelligence Engine** for forecasting wait times into Canada.
- **Problem:** Official data sources only tell you the wait time *now*, not in the future.
- **Solution:** Our new engine analyzes **Historical Patterns** (e.g., "Fridays at 5 PM are busy") and combines them with **Real-Time Data** (e.g., "Traffic is 3x heavier than normal right now").
- **Benefit:** You now get a 3-hour lookahead that tells you if traffic is growing, stable, or clearing up.

### 📱 Mobile-First Teaser Widget
- The new "Status Card" features a simplified **Teaser Widget**.
- **Color-Coded Advice:** Instantly know if you should "Go Now" (Green), "Wait It Out" (Yellow), or "Detour" (Purple).
- **Touch-Friendly:** On mobile, the "View Details" button is now always visible, making navigation effortless.

### 🍱 Web App Installation (PWA)
- You can now **Add BorderQ to your Home Screen** for a faster, app-style experience.
- **Smart Prompts:** Automatically suggests installation on your second visit.
- **Icon Support:** High-resolution icons tailored for iOS and Android.

## 🛠️ Technical Improvements
- **Ratio-Based Prediction:** Implemented a new algorithm (`Current / Historical * Decay`) for high-accuracy short-term forecasting.
- **Deduplication Logic:** Fixed a bug where waiting times that didn't change prevented forecast updates.
- **UI Polish:** Filtered out incomplete Northbound data from Regional Comparison pages to focus strictly on Southbound traffic for this release.
- **Documentation:** Centralized algorithm specs in `docs/FORECAST_LOGIC.md`.
