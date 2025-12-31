# Requirements

## Core Functional Requirements
1.  **Game Session (The Flow)**
    *   **Intervals**: Sessions must be strictly timed using prime number intervals: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 minutes.
    *   **Urge Killer**: One-tap access to a 60-second high-intensity "blitz" mode.
    *   **Progression**: Difficulty scales dynamically or via "levels" (Simple Math -> Complex Operations).
    *   **Lifelines**: 
        *   50-50 (Remove 2 wrong options).
        *   Freeze Time (Pause timer for 10s).
        *   Second Chance (Prevent streak reset).
        *   Simplify (Show hint/estimate).
        *   Skip (Bypass question).

2.  **Platform & Accessibility**
    *   **PWA**: Must work 100% offline. Installable on Android/iOS.
    *   **Local Data**: All progress, stats, and settings stored in `localStorage` or `IndexedDB`.
    *   **No Sign-up**: Immediate start.

## Non-Functional Requirements
1.  **Performance**: Near-instant load time. <100ms response to taps.
2.  **Privacy**: No external trackers, analytics, or ads.
3.  **Aesthetics**: 
    *   Dark Mode only (OLED Black #000000).
    *   Smooth 60fps animations.
    *   Haptic feedback on interaction.

## Constraints
*   No sound effects (default to silent/vibrate-only for discreet usage).
*   No social leaderboards (keep it personal/internal).
