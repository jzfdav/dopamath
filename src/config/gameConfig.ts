/**
 * DopaMath Game Configuration
 * Centralized magic numbers and constants for easier balancing and DX.
 */

export const GAME_CONFIG = {
    // Timing
    CLUTCH_THRESHOLD_SECONDS: 5,
    GRACE_PERIOD_SECONDS: 1,
    TICK_INTERVAL_MS: 1000,
    TRANSITION_DELAY_CORRECT_MS: 150,
    TRANSITION_DELAY_WRONG_MS: 400,

    // Difficulty & Scoring
    MIN_DIFFICULTY: 1,
    MAX_DIFFICULTY: 10,
    BASE_POINTS: 10,
    STREAK_DIFFICULTY_STEP: 5, // Every X correct answers, difficulty increases

    // Sessions
    SESSION_INTERVALS: [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
    DEFAULT_SESSION_MINUTES: 1,

    // Math Generation
    MAX_OPTION_ATTEMPTS: 100,
    OPTION_COUNT: 4,
    ARITHMETIC_VARIANCE: 15,

    // persistence Keys
    STORAGE_KEYS: {
        SETTINGS: "dopamath_settings",
        HISTORY: "dopamath_history",
    },
} as const;
