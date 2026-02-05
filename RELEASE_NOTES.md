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
