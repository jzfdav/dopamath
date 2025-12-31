# DopaMath
**Math is the new Scroll.**

![CI](https://github.com/jzfdav/dopamath/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/jzfdav/dopamath/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/github/license/jzfdav/dopamath)
![v1.0.0](https://img.shields.io/badge/version-1.0.0-blue)

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
</div>

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
