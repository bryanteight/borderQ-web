# Release Notes: v0.3 - The "Mobile Polish" Update

## Overview
This release focuses heavily on **Mobile UI/UX**, ensuring the application is compact, beautiful, and "thumb-friendly" while maintaining a robust desktop experience.

## ✨ New Features
*   **Glassmorphic Region Selector**: Replaced the static region list on mobile with a premium, semi-transparent dropdown (`RegionSelector.tsx`). Desktop retains the expanded list for ease of access.
*   **Collapsible Footer**: Mobile footer now collapses the legal disclaimer into a single summary line to save vertical space, expanding on tap.

## 🎨 UI/UX Improvements
*   **Responsive Card Alignment**:
    *   **Mobile**: Card text aligns **Left** to create a clean vertical visual line next to the divider.
    *   **Desktop**: Card text aligns **Right** to preserve the original spacious design.
*   **Dashboard Spacing**: Removed excessive whitespace and "search bar" leftovers to bring content higher up the fold.
*   **Badge Cleanliness**:
    *   Removed redundant "Standard Vehicles" badges from Hero sections.
    *   Standardized "Passenger" badges to be unobtrusive and consistent inside cards.
*   **Regional Stats Page**:
    *   Fixed Header Hierarchy (H1 Day Name first, H2 Location second).
    *   Converted "Port Comparison" to a **Compact List** on mobile (replacing the carousel) for better comparison at a glance.
    *   **Closed Status**: Explicitly shows "Closed" in red instead of "0 min".

## 🐛 Fixes
*   Fixed "Need navigation?" text to be more accurate ("Crossing the border now?").
*   Fixed jagged alignment on mobile lists.
*   Fixed duplicate H1 tags on stats pages.
*   Fixed Railway deployment failure (Case sensitivity in filenames).

## 🛠 Technical
*   **Version**: Bumped to v0.3 in SiteFooter.
*   **Components**: Created new `RegionSelector` client component.
