# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a parking website built with React, TypeScript, and Vite. The project is currently in early stages with a minimal React + TypeScript + Vite template setup.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler + Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build locally
npm run preview
```

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Linting**: ESLint 9 with TypeScript ESLint, React Hooks, and React Refresh plugins
- **TypeScript**: v5.9.3 with strict mode enabled

## TypeScript Configuration

The project uses TypeScript project references with two separate configurations:
- `tsconfig.app.json` - For application code in `src/`
- `tsconfig.node.json` - For Vite config and Node.js code

Strict mode is enabled with additional checks:
- `noUnusedLocals`, `noUnusedParameters`
- `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports`
- `erasableSyntaxOnly`

## Code Structure

- `src/main.tsx` - Application entry point that renders the root App component
- `src/App.tsx` - Main application component
- Entry point uses React 19's `createRoot` API with StrictMode enabled
- Vite configuration is minimal with just the React plugin enabled

## ESLint Configuration

Uses flat config format (`eslint.config.js`) with:
- Recommended rules from @eslint/js, typescript-eslint
- React Hooks rules (flat config)
- React Refresh rules for Vite HMR
- Global ignores for `dist/` directory
