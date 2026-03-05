# Release Notes v0.7.13 (2026-03-05)

## 🚀 New Features
- feat(twitter): redesigned alerts to show comparative wait times across all 3 cascadia crossings (departures board style)
- feat(twitter): implemented smart congestion checking; skips tweeting if all neighbor ports are also >20m
- feat(twitter): implemented X.com API budget guardrails (max 2 tweets/day, 2-hour region cooldown) ensuring <$3/mo spend

## 🐛 Bug Fixes
- fix(release): run npm install in frontend to prevent package lock desync
