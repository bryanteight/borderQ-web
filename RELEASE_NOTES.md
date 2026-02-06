# Release Notes v0.7.3 (2026-02-05)

## 🚀 Key Improvements

### ⚡ Real-Time Nowcast (Beta)
- **Physics-Based Search**: Uses the Dynamics Vector Engine to encode traffic momentum and acceleration.
- **High-Resolution Sampling**: Switches from hourly increments to **30-minute intervals** during surges.
- **"Surge Ahead" Badge (⚡)**: Purple high-visibility badge signaling rapid traffic changes.

### 📢 Smart Alerting with Vision
- **Discord Camera Snapshots**: High-traffic alerts now include **Live Camera Snapshot URLs** for visual verification.
- **Crossing-Specific Views**: Alerts automatically fetch cameras for the port that triggered the surge.

### 🏛️ Engineering & Architecture
- **SOLID Refactor**: Decoupled Nowcast logic into `nowcast_service.py`, reducing router complexity.
- **Nowcast Beta Section**: Added educational content to the "About Us" page detailing the physics engine.
- **Mock Cleanup**: Fully purged demo code and verified with UI regression suite.

---

# Release Notes v0.7.2 (2026-02-05)

## 🚀 Key Improvements

### 🎨 Design & UX Overhaul
- **Premium Badge System**: Redesigned all status badges (Green, Yellow, Red, Event) to follow a high-contrast "App Icon" squircle style with `rounded-[1.2rem]` corners.
- **Custom Sun Icon**: Introduced a custom-designed SVG Sun for the "Fastest Crossing" status, providing more visual weight than the standard library icon.
- **Brand Alignment**: Synchronized the dashboard aesthetic with the BorderQ emerald-green logo.

### 🧠 Logic & Intelligence
- **Strict Matchup Filtering**: The "Plan Ahead" impact badge now only highlights true cross-border events (Relevance ≥ 1.0). This removes noise from local-only games and ensures actionable travel alerts.
- **Northbound Activation**: Enabled historical data and AI-generated forecasts for Northbound traffic (Seattle to Vancouver).

### ⚡ Performance & Quality
- **8x Faster Planning API**: Optimized the `/summary` endpoint by switching to batch-fetching from Qdrant, reducing latency from 1.6s to under 0.2s.
- **SOLID Refactoring**: Decoupled the planning logic from the router into a standalone `PlanningService`, improving maintainability and testability.
- **Regression Verified**: Passed all UI and Backend health checks.

## 📦 Technical Changes
- Updated version tags to `v0.7.2` across Backend (`app/main.py`) and Frontend (`package.json`, `SiteFooter.tsx`).
- Created dedicated `planning_service.py` to handle 7-day forecast aggregation.
