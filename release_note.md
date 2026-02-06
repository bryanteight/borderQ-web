# Release Note v0.7.3 (2026-02-05)

## ⚡ Real-Time Nowcast (Beta)
The headline feature of v0.7.3 is the introduction of **Nowcasting**, a physics-based forecasting engine that identifies short-term traffic surges before they happen.

### 🧠 Nowcast Engine (Dynamics Vector)
- **Physics-Based Search**: Uses the Dynamics Vector Engine to encode traffic momentum and acceleration. Matches current "traffic physics" against historical patterns to identify short-term trajectories.
- **High-Resolution Sampling**: When a Nowcast event is active, the dashboard switches from hourly increments to **30-minute intervals** (`Now`, `+30m`, `+1h`, `+1.5h`), providing surgical precision during surges.
- **Surge Activation**: Automatically triggers when at least 4 historical patterns with matching physics signatures are found, ensuring high-confidence predictions.

### 🎨 UI & UX Improvements
- **"Surge Ahead" Badge (⚡)**: New purple high-visibility badge that appears when a Nowcast surge is detected, signaling users to "Go Now" or "Hold".
- **Dynamic Chart Overwrite**: The forecast sparklines now dynamically update to show high-resolution Nowcast points during active surges.
- **Beta Explanation Section**: Added a new "Real-Time Nowcast (Beta)" section to the **About Us** page to explain the technology behind physics-based forecasting.

### 📢 Smart Alerting with Vision
- **Discord Camera Snapshots**: High-traffic alerts (>30m) now automatically fetch and include **Live Camera Snapshot URLs** directly in the Discord message, allowing moderators to visually verify congestion.
- **Adaptive Triggers**: The alerting system now passes the specific `crossing_id` to fetch the most relevant camera viewpoints (e.g., Peace Arch 📷).

### 🛠️ Professional Architecture (SOLID)
- **Nowcast Service Decoupling**: Extracted all Nowcast and recommendation logic from the summary router into a dedicated `nowcast_service.py` following SRP (Single Responsibility Principle).
- **Cleaner API Routers**: Simplified `summary.py` by offloading complex data enrichment to the service layer.
- **Regression Testing**: All changes verified by the UI Regression suite; restored clean production state by removing all demo/mock code.

## 📦 Technical Changes
- Created `app/services/nowcast_service.py` for surge detection and chart data sampling.
- Updated `app/services/alerting.py` and `app/services/ingest/pipeline.py` for camera-enriched Discord alerts.
- Bumped version to `v0.7.3` across all systems.
