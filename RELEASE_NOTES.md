# Release Notes v0.7.8 (2026-02-19)

## 🚀 New Features
- Add data verification & sanity check skill with `scripts/sanity_check.py` for live data auditing
- Add Discord alerting for Detroit (DW Tunnel API) and Niagara (Peace Bridge Scraper) fetch failures
- Add multi-region support (Cascadia, Detroit, Niagara) to the data verification tool

## 🐛 Bug Fixes
- Fix CBP data fetch in sanity check script (was not unpacking tuple return from `fetch_realtime_data`)
- Fix DW Tunnel API wait time parsing in sanity check (parse `DetailsTravelTime` string like `"< 20"`)
- Fix inline `import re as _re` shadowing in `fusion.py` (moved to top-level import)

## 🔧 Maintenance
- Mark SOLID refactoring skill as ALWAYS-ACTIVE for all future code changes
- Clean up verbose dev comments in `sanity_check.py` (15 lines → 1 line)
- Remove unused `import time` from `sanity_check.py`
- Remove temporary test script `scripts/test_discord_alerts.py`
