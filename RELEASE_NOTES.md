# Release Notes v0.7.1 (2026-02-02)

## 🚀 New Features
- fix: improved long weekend detection logic and added unit tests
- feat: add long weekend forecast tier and increase sample limits
- perf: optimize Railway memory usage - limit uvicorn workers, add scheduler Dockerfile

## 🐛 Bug Fixes
- fix: weekend forecast now uses most recent patterns instead of arbitrary index order
- fix: cap Updated At timestamp to never show future time
- fix: prioritize Lynden South camera as thumbnail

