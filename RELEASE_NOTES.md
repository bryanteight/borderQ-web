# Release Notes v0.7.5 (2026-02-12)

## 🚀 New Features
- feat(data): accurate holiday historical data import (Presidents' Day peak now 120m vs 11m)
- feat(script): new maintenance/import_holiday_data.py for CBP holiday API

## 🐛 Bug Fixes
- fix(frontend): hide 'Plan Ahead' widget for Northbound traffic (prevent misleading 0-min forecasts)
- fix(deploy): upgrade to python 3.10 to support type union syntax in vision service
- fix(deploy): install opencv system dependencies (fixes 502 libGL error)

