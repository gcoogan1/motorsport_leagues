# Getting Started

Welcome to **Motorsport Leagues**, a web platform for GT7 and iRacing players to create, join, and follow racing leagues. This guide will help you set up the project locally, understand the folder structure, and get the app running.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** >= 20
- **npm** >= 9 (or Yarn)
- **Git**
- A code editor like **VS Code**
- A modern web browser (Chrome, Edge, or Firefox)

---

## Clone the Repository

```bash
git clone https://github.com/gcoogan1/motorsport_leagues.git
cd motorsport_leagues
npm install
```
## Folder Structure:

src/

├── app/             # Global providers, routing config, global styles
├── assets/          # Global static assets (images, fonts, icons)
├── components/      # Reusable UI components
├── features/        # Feature modules (leagues, auth, etc.)
├── pages/           # Route-based page components
├── hooks/           # Reusable hooks
├── lib/             # External lib/wrappers
├── services/        # API clients (Supabase, etc.)
├── store/           # Global state management (Redux tookit)
├── types/           # Global TypeScript types
└── utils/           # Helper Functions

## Setup Environment Variables

Create a local environment file: 

VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

## Run the Development Server

```bash
npm run dev
```
Open http://localhost:5173 in your browser. You should see the MotorSportLeagues app running.

