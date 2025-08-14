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


## Original Game prompt:

Create a 3D Cricket Game with below actions, Make theme proper Game Vibe.

Allow the game to Two Team Match or Play with Computer.
1.1 Allow user to choose team.

Each team can have batting players upto five . Means each team have four wickets.

Allow over options to be 2, 5, 10,20.

Allow Toss to decide Batting Side. Who Wins the toss have always batting first as there is no option for bowling to choose.

Batting team 1st player will start game.

When Player presses start button It should allow to flip page of a book quickly, and when player press stop button page flip should be stopped and show a page number.

Add Restart button to restart match.
Rules:

flipping a Page should be allowed only on even number and only even number should use to build up a score.
2.If Last digit of a page number is
2.1 Greater than 0 and less than 8, Then add it to the score card.
2.2 Zero (0) than consider is out , Player should decrement from a team wicket.

Other than above all general cricket rules should be applied.