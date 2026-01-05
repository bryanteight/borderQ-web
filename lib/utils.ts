import { BorderEvent } from "./types";

/**
 * reliable way to get the URL friendly slug for a port event.
 * Handles legacy data (missing slug) and Northbound suffix issues.
 */
export function getSlugFromEvent(event: BorderEvent): string {
    // 1. Prefer event.slug if available (Backend Source of Truth)
    if (event.slug) {
        return event.slug.replace(/-nb$/, "");
    }

    // 2. Fallback: Slugify the name (Last resort for legacy data)
    // "Peace Arch / Douglas (Southbound)" -> "peace-arch-douglas"
    // Note: This might not match PORT_METADATA keys exactly, but prevents broken links.
    return event.crossing_name
        .toLowerCase()
        .replace(/\(northbound\)|\(southbound\)/g, "")
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
