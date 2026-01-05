import { BorderEvent } from "./types";

/**
 * Reliable way to get the URL friendly slug for a port event.
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

/**
 * Lynden has fixed operating hours: 8 AM - Midnight PST.
 * This function checks if Lynden is currently open based on the client's clock.
 * Used to overlay "Closed" status on the frontend even if backend hasn't updated yet.
 */
export function isLyndenCurrentlyOpen(): boolean {
    const now = new Date();
    const pstHour = parseInt(
        now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: 'America/Los_Angeles'
        })
    );
    // Open from 8 AM (hour 8) to Midnight (hour 24, but 0 is next day)
    // So open when hour >= 8 AND hour < 24 (which is always true if >= 8 in same day)
    // Closed when hour < 8 (midnight to 8 AM)
    return pstHour >= 8;
}

/**
 * Checks if an event should be displayed as "Closed" based on:
 * 1. Backend status field
 * 2. Frontend time-based override for Lynden
 */
export function isEventClosed(event: BorderEvent): boolean {
    // Backend says closed
    if (event.status === "Closed") {
        return true;
    }

    // Frontend override for Lynden based on operating hours
    const isLynden = event.crossing_name.toLowerCase().includes("lynden") ||
        event.slug?.includes("lynden");

    if (isLynden && !isLyndenCurrentlyOpen()) {
        return true;
    }

    return false;
}
