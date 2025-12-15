# Copilot Instructions for Motorsport Leagues

## Project Overview
React + TypeScript + Vite application for motorsport leagues management. Uses React 19 with SWC for fast refresh and modern TypeScript configuration.

## Development Workflow

### Build & Development
- **Start dev server**: `npm run dev` (Vite dev server with HMR)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Lint**: `npm run lint` (ESLint with flat config)
- **Preview**: `npm run preview` (Preview production build)

### Key Technologies
- **Bundler**: Vite 7+ with @vitejs/plugin-react-swc for SWC-based fast refresh
- **TypeScript**: Strict mode enabled, uses composite project references
- **React**: v19 with modern JSX transform and StrictMode
- **Linting**: ESLint 9 flat config with React Hooks and React Refresh plugins

## TypeScript Configuration

### Project Structure
Uses TypeScript composite references:
- `tsconfig.json`: Root reference config
- `tsconfig.app.json`: App source code (src/)
- `tsconfig.node.json`: Build tools and config files

### Important Compiler Options
- **Module Resolution**: "bundler" mode for Vite compatibility
- **JSX**: "react-jsx" (automatic runtime)
- **Strict Mode**: Full strict TypeScript enforcement
- **No Emit**: True (Vite handles building)

## Code Conventions

### Component Patterns
```tsx
// Prefer arrow function components with explicit return types when needed
const ComponentName = (): JSX.Element => {
  return <div>content</div>
}

export default ComponentName
```

### File Structure
- **Components**: Place in `src/` with `.tsx` extension
- **Styles**: Co-located `.css` files (e.g., `App.css` next to `App.tsx`)
- **Assets**: Static files in `src/assets/`
- **Entry Point**: `src/main.tsx` with React.StrictMode wrapper

### Import Conventions
- Use `.tsx` extension explicitly for TypeScript imports
- CSS imports: `import './Component.css'`
- Relative imports from `src/` directory

## ESLint Configuration
Flat config with these rule sets:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules  
- `eslint-plugin-react-hooks` for React Hooks rules
- `eslint-plugin-react-refresh` for Vite fast refresh compatibility

### Key Linting Rules
- React Hooks rules enforced for proper hook usage
- TypeScript strict rules for type safety
- React Refresh rules for HMR compatibility
- `dist/` directory globally ignored

## Development Notes

### React 19 Specific
- Uses automatic JSX runtime (no need to import React in components)
- Utilizes createRoot from react-dom/client
- StrictMode enabled for development warnings

### Build Process
1. TypeScript compilation check (`tsc -b`)
2. Vite build with SWC transformation
3. Output to `dist/` directory (auto-ignored by ESLint)

### Performance Considerations
- SWC used instead of Babel for faster builds
- Vite's fast refresh for instant development feedback
- TypeScript incremental compilation with build info cache

## Common Tasks

### Adding New Components
1. Create `.tsx` file in `src/`
2. Create co-located `.css` file if needed
3. Export as default export
4. Import with `.tsx` extension

### Styling Approach
- CSS Modules pattern available via Vite
- Global styles in `src/index.css`
- Component-specific styles co-located

### Type Safety
- Enable strict TypeScript checking
- Use explicit types for props and complex state
- Leverage TypeScript's DOM types for event handlers