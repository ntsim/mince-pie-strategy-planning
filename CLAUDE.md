# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Christmas-themed strategic mapping mini-game based on Wardley Mapping principles. Players map out a "mince pie delivery operation" by placing components on a strategic canvas with real-time scoring and interactive commentary from Rudolph the Red-Nosed Reindeer.

## Tech Stack

- **React 19.2** with TypeScript 5.9 (strict mode enabled)
- **Vite 7.2** for development and build
- **Tailwind CSS 4.1** for styling (using v4 plugin, not PostCSS)
- **pnpm** as package manager
- **ESLint** with flat config format

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:5173)
pnpm dev

# Type checking
tsc -b

# Production build (outputs to dist/)
pnpm build

# Preview production build
pnpm preview

# Lint
pnpm lint
```

## Architecture

### State Management Pattern

This project uses **derived state** and **individual state variables** rather than a single centralized game state object:

- **Derived state with `useMemo`**: Score and badges are computed from `components` and `dependencies`
- **Individual `useState` hooks**: Separate state variables for different concerns (`components`, `dependencies`, `commentary`, etc.)
- **Memoized callbacks with `useCallback`**: Stable function references passed to child components
- **No global state management library**: React built-in hooks are sufficient for this app's complexity

### Component Structure

```
src/
├── components/
│   ├── StrategyCanvas.tsx      # Main drag-and-drop canvas with grid
│   ├── MapComponent.tsx         # Individual draggable components
│   ├── DependencyLines.tsx      # SVG lines connecting components
│   ├── Characters.tsx           # Rudolph and Patch with commentary system
│   ├── ScorePanel.tsx          # Score display and badges
│   └── Certificate.tsx         # Completion certificate modal
├── types/
│   └── game.types.ts           # All TypeScript type definitions
├── utils/
│   ├── gameData.ts             # Component definitions and initial game data
│   ├── scoring.ts              # Scoring algorithm and badge checking
│   └── commentary.ts           # Rudolph's commentary generation
├── App.tsx                     # Main app with game orchestration
└── App.css                     # Custom animations and transitions
```

### Key Technical Patterns

1. **Type Safety**: All strict TypeScript flags enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`). No `any` types.

2. **Performance Optimization**:
   - Memoized score calculation to avoid expensive recalculations on every render
   - Memoized badge computation
   - `useCallback` for event handlers passed to child components

3. **Drag-and-Drop**: Uses HTML5 Drag and Drop API (not a library). Components can be dragged from sidebar or repositioned on canvas.

4. **Dependency System**: Click-to-select workflow where clicking one component then another creates a dependency line between them.

5. **Commentary System**: Reactive commentary from Rudolph based on:
   - Component placement location
   - Classification choices (Build/Buy/Repurpose)
   - Dependency creation
   - Score milestones
   - Game completion
   - Easter egg (triple-click Rudolph)

## Game Mechanics

### Scoring Algorithm (0-100 scale)

Located in `src/utils/scoring.ts`:

- **Position Accuracy (30%)**: Distance-based calculation from correct position
- **Classification Accuracy (30%)**: Correct Build/Buy/Repurpose decisions
- **Dependency Logic (25%)**: Creating logical dependencies between components
- **Completion Bonus (15%)**: Placing all components and classifying them

### Badge System

Five badges can be earned:

- **Cloud Wisdom** ☁️ - Correctly classified commodity cloud services
- **Innovation Star** ⭐ - Identified novel components to build
- **Reindeer Efficiency** 🦌 - Made smart repurpose decisions
- **Strategic Mapper** 🗺️ - Completed map with score >70
- **Dependency Master** 🔗 - Created 5+ logical dependencies

Badge logic is in `checkBadgeEarned()` in `src/utils/scoring.ts`.

## Styling

### Custom Colors (defined in `src/index.css`)

```css
--christmas-red: #c41e3a --christmas-green: #165b33 --christmas-gold: #ffd700
  --snow-white: #fffafa --winter-blue: #4a7c9c;
```

### Tailwind CSS v4 Setup

This project uses Tailwind CSS v4 with the **Vite plugin** (not PostCSS):

- Configuration: `@tailwindcss/vite` plugin in `vite.config.ts`
- No `tailwind.config.js` file needed
- Custom theme values defined directly in CSS using `@theme` directive in `src/index.css`

## Data Management

### Component Definitions

All 11 game components are defined in `INITIAL_COMPONENTS` in `src/utils/gameData.ts`. Each component has:

- `correctPosition`: Target position on canvas (x: 0-100, y: 0-100)
- `correctClassification`: Expected Build/Buy/Repurpose choice
- `correctEvolution`: Expected evolution stage (genesis/custom/product/commodity)

When adding new components or modifying existing ones, update this file.

### Evolution Stages (Wardley Map X-axis)

- **Genesis** (0-25): Novel, uncharted territory
- **Custom Built** (25-50): Custom solutions
- **Product/Service** (50-75): Productized offerings
- **Commodity/Utility** (75-100): Standardized, commoditized

Defined in `EVOLUTION_STAGES` in `src/utils/gameData.ts`.

## ESLint Configuration

Uses flat config format (`eslint.config.js`):

- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` recommended rules
- `eslint-plugin-react-refresh` vite config

## TypeScript Configuration

Two separate tsconfigs using project references:

- `tsconfig.app.json`: App source code (src/)
- `tsconfig.node.json`: Vite config files

Target: ES2022 with strict mode and all strict flags enabled.

## Browser Requirements

- Modern browsers with ES2022 support
- HTML5 Drag and Drop API
- SVG support for dependency lines
- CSS Grid and Flexbox

## Testing

No test framework currently configured. If adding tests, consider Vitest (already compatible with Vite).
