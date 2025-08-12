# Overview

This is a 3D cricket game built with React, Three.js, and Express.js. The game features an immersive 3D stadium environment where players compete in cricket matches using a unique page-flipping mechanic to determine scores. Players flip through pages of a virtual book, and the last digit of the page number determines the outcome of each ball - whether it's runs scored, no score, or a wicket.

The application includes team selection, match customization (2-20 overs), toss mechanics, and full cricket scoring with innings breaks and match results. The game supports both two-player and vs-computer modes with a comprehensive UI overlay system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Three.js with React Three Fiber** for 3D graphics and stadium rendering
- **Zustand** for state management with separate stores for game logic, cricket rules, and audio
- **Tailwind CSS** with Radix UI components for styling and UI elements
- **Vite** as the build tool and development server

## Backend Architecture  
- **Express.js** server with TypeScript support
- **Memory-based storage** using in-memory data structures for user management
- **RESTful API** structure with routes organized under `/api` prefix
- **Development/production** build separation with esbuild for production bundling

## Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with schema definitions
- **In-memory storage** implementation as fallback/development option
- **User management** with basic CRUD operations for users and authentication

## Game Logic Architecture
- **Multi-phase game system** with distinct phases (team selection, settings, toss, playing, break, end)
- **Cricket rules engine** with accurate scoring calculations based on page number mechanics
- **State-driven UI** that renders different components based on current game phase
- **Audio system** with mute/unmute functionality and sound effects for game actions

## 3D Rendering System
- **Stadium environment** with textured cricket field, stands, and lighting
- **Page-flipping book** as the central game interaction mechanism
- **Camera controls** with optimized positioning for cricket field view
- **Performance optimizations** for mobile and desktop rendering

## External Dependencies

- **@neondatabase/serverless** - PostgreSQL database connectivity
- **@radix-ui components** - Accessible UI component library  
- **@react-three/fiber & @react-three/drei** - 3D rendering and utilities
- **@tanstack/react-query** - Server state management and API calls
- **drizzle-orm & drizzle-kit** - Database ORM and migration tools
- **connect-pg-simple** - PostgreSQL session store for Express
- **vite-plugin-glsl** - GLSL shader support for enhanced 3D graphics