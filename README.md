# Motorsport Leagues

**A web platform for creating, managing, and participating in online racing leagues across Gran Turismo 7.**

[Live Application →](https://motorsportleagues.com/)

[View Source →](https://github.com/gcoogan1/motorsport_leagues)

---

## Overview

Motorsport Leagues is an actively developed web application built to make online racing league management easier for both organizers and drivers.

The application is currently deployed and publicly accessible, but it remains a work in progress. Core functionality is in place while additional features, improvements, and refinements continue to be developed.

## Features

### League Management

Create and manage racing leagues, seasons, and league-specific information.

### Racing Events

Organize race events with scheduling and event information for league participants.

### Driver Profiles

Drivers can maintain profiles and participate in multiple racing leagues.

### Teams & Squads

Organize drivers into teams/squads and manage membership and invitations.

### Notifications

Keep users informed about invitations, announcements, and other league activity.

### Authentication

User authentication and session management are handled through Supabase Authentication.

### Rich Content

League information and announcements support rich-text content through Tiptap.

### Image Management

User and racing-related images can be uploaded and optimized before being stored.

## Technology

### Frontend

* React
* TypeScript
* Vite
* React Router
* Redux Toolkit
* RTK Query
* styled-components
* React Hook Form
* Zod
* Tiptap
* Storybook

### Backend & Database

* Supabase
* PostgreSQL
* Supabase Authentication
* Row Level Security
* Supabase Storage

### Testing

* Playwright
* Storybook

### Deployment

* Netlify

## Architecture

The application uses a feature-oriented React structure with separate areas for application state, services, reusable components, providers, hooks, pages, and shared types/utilities.

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── pages/
├── providers/
├── rtkQuery/
├── services/
├── store/
├── types/
└── utils/
```

This structure allows feature-specific functionality to remain organized while keeping shared UI, state, and services reusable throughout the application.

## State Management

Redux Toolkit is used for application state, while RTK Query handles server-side data fetching, caching, and synchronization.

This provides a consistent approach for managing remote data while keeping application state separate from server state.

## Database & Security

The backend uses PostgreSQL through Supabase.

Authentication is handled through Supabase Auth, while PostgreSQL Row Level Security provides database-level access control.

Using RLS allows permissions to be enforced at the database level rather than relying exclusively on frontend authorization checks.

## Forms & Validation

Forms are built using React Hook Form with Zod schemas for validation.

TypeScript provides additional compile-time type safety throughout the application.

## Component Development

Storybook is used to develop and document reusable UI components independently from the main application.

This allows components to be developed, tested, and refined in isolation.

## Testing

 **Playwright** provides end-to-end browser testing.

Storybook is also used as part of the component development workflow.

## Image Optimization

Images are processed before upload to reduce unnecessary storage and bandwidth usage.

The application uses client-side image compression for supported uploads.

## Development

### Requirements

* Node.js
* npm

### Installation

```bash
npm install
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Storybook

```bash
npm run storybook
```

## Environment Variables

The application uses environment variables for external services and deployment configuration.

Sensitive credentials and private keys should never be committed to the repository.

For local development, configure the required variables in your local environment.

## Documentation

Additional project documentation is available in the [`docs`](./docs) directory.

Documentation covers areas including:

* Authentication
* Account management
* Leagues
* Events
* Profiles
* Squads
* Providers
* Styling
* Getting started

## Engineering Highlights

This project has given me hands-on experience with:

* Designing and building a production React application
* Developing with TypeScript at scale
* Designing relational PostgreSQL schemas
* Implementing database-level authorization with RLS
* Building reusable component systems
* Managing server state with RTK Query
* Building validated forms
* Implementing authentication and user sessions
* Supporting event scheduling and time zones
* Optimizing uploaded images
* Developing components with Storybook
* Writing automated tests
* Deploying and maintaining a live application

## Links

**Live Application:**
https://motorsportleagues.com/

**GitHub:**
https://github.com/gcoogan1/motorsport_leagues

