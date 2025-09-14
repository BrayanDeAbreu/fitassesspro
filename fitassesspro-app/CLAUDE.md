# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native fitness assessment application built with Expo and Expo Router. The project uses file-based routing where the app directory structure determines the navigation structure, and Supabase as the backend database.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android    # Start with Android emulator
npm run ios        # Start with iOS simulator
npm run web        # Start web version

# Code quality
npm run lint       # Run ESLint

# Reset project (moves starter code to app-example and creates blank app directory)
npm run reset-project
```

## Architecture

- **Framework**: React Native with Expo SDK ~54.0
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Routing**: Expo Router v6 (file-based routing)
- **Navigation**: React Navigation v7 with bottom tabs
- **Language**: TypeScript
- **Styling**: React Native StyleSheet API with inline styles

### Key Dependencies

- `expo-router`: File-based routing system
- `@react-navigation/bottom-tabs`: Tab-based navigation
- `react-native-gesture-handler` & `react-native-reanimated`: Enhanced animations and gestures
- `expo-image`: Optimized image component

### Project Structure

- `app/`: Main application code with file-based routing
  - `_layout.tsx`: Root layout component with Stack navigator
  - `index.tsx`: Home screen component
- `assets/`: Static assets like images and fonts
- `node_modules/`: Dependencies
- Configuration files: `app.json`, `package.json`, `tsconfig.json`, `eslint.config.js`

### File-Based Routing

The app uses Expo Router's file-based routing system where:
- Files in the `app/` directory automatically become routes
- `_layout.tsx` files define layout components
- `index.tsx` represents the root route of that directory
- Navigation structure mirrors the file system structure

## Development Notes

- The project uses React Native 0.81.4 with React 19.1.0
- TypeScript is configured for type checking
- ESLint is set up with Expo's configuration for code linting
- The app supports Android, iOS, and web platforms through Expo