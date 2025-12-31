# Design Specs

## Visual Identity
*   **Theme**: Cyber-Zen. Digital precision meets calm focus.
*   **Colors**:
    *   Background: `#000000` (OLED Black)
    *   Primary Accent: `#00ff9d` (Neo-Mint / Success)
    *   Secondary Accent: `#bd00ff` (Electric Purple / High Focus)
    *   Error: `#ff0055` (Soft Neon Red)
    *   Text: `#ffffff` (White - Variable Opacity)
*   **Typography**: Monospace numerals (e.g., `JetBrains Mono` or `Roboto Mono`) for math; Clean Sans-serif (e.g., `Inter`) for UI.

## UX Patterns
*   **The "Pulse"**: The background or UI elements should have a subtle, breathing animation during "thinking" time.
*   **Interaction**: Large, thumb-friendly tap zones. 
    *   Answer buttons should take up the bottom 40% of the screen.
*   **Feedback**: 
    *   Correct: Screen flash (subtle) + crisp haptic tap + progress bar fill.
    *   Incorrect: Shake animation + heavy haptic thud.

## Architecture
*   **Framework**: Preact (via Vite) for minimal bundle size.
*   **State**: React Context + LocalStorage reducer.
*   **Routing**: Minimal router (Home -> Game -> Summary).

## Layouts
1.  **Home**: Big "Urge Killer" button. Scrollable list of "Prime Intervals".
2.  **Game**:
    *   Top: Timer (Progress bar, not just numbers).
    *   Center: The Equation (Large font).
    *   Bottom: 4-Grid of Answer Buttons + Lifeline Bar.
3.  **Summary**:
    *   "Dopamine Earned" (Points/Streak).
    *   Accuracy Graph.
    *   "Go Again" or "Done".
