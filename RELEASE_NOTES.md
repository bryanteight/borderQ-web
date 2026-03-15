# Release Notes v0.7.14 (2026-03-15)

## 🚀 New Features
- feat(scheduler): add startup alert for missing twitter credentials
- fix(docker): rebuild Dockerfile.scheduler with full COPY app/ to prevent drift, add Dockerfile Sync Guard skill
- feat(twitter): show traffic spike context with (was X min) and dual US/CA port names
- feat(twitter): persist daily tweet counter in Qdrant for deploy-safe budget tracking

## 🔧 Maintenance
- refactor(twitter): move tweet counter to dedicated system_settings collection

## 📦 Other Changes
- perf(memory): remove heavy static imports from camera package __init__.py to prevent ~100MB accidental memory leak in scheduler
- perf: reduce health probe from 17 URLs/5min to 5 URLs/30min (95% fewer self-requests)

