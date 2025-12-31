# DopaMath
**Math is the new Scroll.**

![License](https://img.shields.io/badge/license-MIT-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

DopaMath is a PWA designed to break the doom-scrolling loop by providing a high-dopamine, productive alternative: solving rapid-fire math problems. It uses game design psychology—streaks, haptics, and immediate feedback—to make mental arithmetic as addictive as a social feed.

## Features

- **🧠 Active Consumption**: Replace passive scrolling with active cognitive effort.
- **⚡ Flow State Mechanics**: Difficulty scales dynamically with your streak.
- **📱 Thumb-First Design**: Optimized "Thumb Zone" UI for one-handed usage.
- **🎨 Premium Aesthetics**: OLED-black themes, neon accents, and 60fps animations.
- **🛠️ Offline First**: Fully installable PWA with offline support.
- **🆘 Lifeline System**: 50/50, Time Freeze, Skip, and Second Chance mechanics.
- **📊 Deep Stats**: Track your dopamine reclamation with detailed history and graphs.

## Architecture

The codebase follows a modular feature-first architecture:

```
src/
├── components/     # UI Atoms (Button, Timer, etc.)
├── config/         # Centralized Game Config (gameConfig.ts)
├── context/        # State Management
│   └── game/       # Modular Game State (Reducer, Types, Provider)
├── hooks/          # Custom Logic (useGameLogic, useLifelineManager)
├── pages/          # Route Views (Home, Game, Stats)
└── utils/          # Pure Functions (Math, Storage, Audio)
```

### Key Technologies
- **Vite + React**: Lightning fast dev server and build.
- **Tailwind v4**: Next-gen styling engine.
- **Framer Motion**: Complex orchestrations and layout transitions.
- **Vitest**: Unit testing for logic and state.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Build for production
npm run build
```

## Configuration

Game balance is centralized in `src/config/gameConfig.ts`. You can tune:
- `CLUTCH_THRESHOLD_SECONDS`: When the "Grace Period" kicks in.
- `STREAK_DIFFICULTY_STEP`: How fast the game gets harder.
- `BASE_POINTS`: Base score per question.

## License

MIT © [JZF](https://github.com/jzfdav)
