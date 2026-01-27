# Getting Started

Welcome to **Motorsport Leagues**, a web platform for GT7 and iRacing players to create, join, and follow racing leagues. This guide will help you set up the project locally, understand the folder structure, and get the app running.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** >= 20

---

## Clone the Repository

```bash
git clone https://github.com/gcoogan1/motorsport_leagues.git
cd motorsport_leagues
npm install
```

## Install Dependencies:
```bash
npm install
```

## Folder Structure:
```
src/
├── app/          # Global providers, routing config, global styles
├── assets/       # Global static assets (images, fonts, icons)
├── components/   # Reusable UI components (buttons, inputs, etc.)
├── features/     # Feature-based modules (leagues, auth, accounts)
├── hooks/        # Reusable custom React hooks
├── lib/          # External library configurations/wrappers
├── pages/        # Route-based page components
├── services/     # API clients and data fetching (e.g., Supabase)
├── store/        # Global state management (Redux Toolkit)
├── types/        # Global TypeScript interfaces and types
└── utils/        # Shared helper functions and constants
```

## Setup Environment Variables

Create a local environment file: 
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Run the Development Server

```bash
npm run dev
```
Open http://localhost:5173 in your browser. You should see the Motorsport Leagues app running.

