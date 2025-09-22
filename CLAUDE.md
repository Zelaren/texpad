# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React + TypeScript + Vite** project named "texpad". It's a minimal starter template with modern React development setup including HMR (Hot Module Replacement) and ESLint configuration.

## Development Commands

### Core Development Workflow
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Build Process
The build process automatically runs TypeScript compilation (`tsc -b`) before Vite build, ensuring type safety before bundling.

## Technology Stack

### Core Dependencies
- **React 19.1.1** - Latest React version with modern features
- **React DOM 19.1.1** - DOM rendering for React
- **TypeScript ~5.8.3** - Static type checking
- **Vite 7.1.6** - Fast build tool and dev server

### Development Tools
- **ESLint 9.35.0** - Code linting with modern flat config
- **@vitejs/plugin-react 5.0.2** - React plugin for Vite (uses Babel for Fast Refresh)
- **TypeScript ESLint 8.43.0** - TypeScript-specific ESLint rules
- **React Hooks ESLint plugin 5.2.0** - React Hooks linting rules
- **React Refresh ESLint plugin 0.4.20** - Fast Refresh optimization

## Project Structure

```
src/
├── assets/
│   └── react.svg           # React logo asset
├── App.tsx                 # Main application component
├── App.css                 # Application styles
├── main.tsx                # Application entry point
├── index.css               # Global styles
└── vite-env.d.ts           # Vite environment types

public/
└── vite.svg                # Vite logo asset

index.html                  # HTML template
```

## TypeScript Configuration

### Key Compiler Options
- **Target**: ES2022 with modern JavaScript features
- **Module**: ESNext with bundler module resolution
- **Strict Mode**: Enabled with additional strict checks
- **JSX**: React-JSX transform (no React import needed)
- **Linting Rules**:
  - `noUnusedLocals` and `noUnusedParameters` enabled
  - `noFallthroughCasesInSwitch` enabled
  - `noUncheckedSideEffectImports` enabled
  - `verbatimModuleSyntax` enabled

### Configuration Files
- `tsconfig.json` - Project references configuration
- `tsconfig.app.json` - Application-specific TypeScript configuration
- `tsconfig.node.json` - Node.js tooling configuration

## ESLint Configuration

### Current Setup
- Uses modern ESLint flat config format
- Includes recommended TypeScript rules
- React Hooks linting with latest recommendations
- React Refresh optimizations for Vite
- Ignores `dist/` directory

### Potential Enhancements
The README suggests enabling type-aware linting for production:
- `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Additional React-specific plugins: `eslint-plugin-react-x` and `eslint-plugin-react-dom`

## Development Patterns

### Component Structure
- Functional components with TypeScript
- React hooks for state management
- CSS modules or global CSS (currently using global CSS)
- Asset imports through Vite (SVG imports work directly)

### Build Optimization
- Vite handles module bundling and tree-shaking
- TypeScript compilation integrated into build process
- Fast Refresh enabled during development
- Production builds are optimized and minified

## Important Notes

- This is a fresh project template with minimal boilerplate
- The current `App.tsx` contains the standard Vite+React starter counter demo
- No existing tests are configured
- Uses Bun package manager (evidenced by `bun.lock` file)
- Project name "texpad" suggests this may evolve into a text editor or text processing application