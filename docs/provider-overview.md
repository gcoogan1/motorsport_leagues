# Providers Overview

This project uses **React Context Providers** to manage cross-cutting application state in a predictable, testable way.

Providers are used for **application-level concerns**, not component-local state.

---

## What Is a Provider?

A **Provider** is a React Context wrapper that:

- Owns a specific domain of state
- Exposes a clear, typed API
- Can be consumed anywhere in the app via a custom hook
- Prevents prop-drilling
- Centralizes logic and side effects

Providers in this app:
- Auth
- Modal
- Panel
- Theme
- Toast
- Mock (for storybook)

---

## Provider Design Principles

All providers in this codebase follow these rules:

### 1. One Provider = One Responsibility
A provider should manage **one domain only**.

- `AuthProvider` → auth state
- `PanelProvider` → panel visibility & behavior


---

### 2. Always Use a Safe Hook
Every provider **must** expose a custom hook.

```ts
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
```

This prevents silent bugs and enforces correct usage.

### 3. Context Is Never Used Directly

Consumers never import the context directly.

❌ Don’t do this:

```ts
useContext(AuthContext)
```

✅ Always do this:

```ts
useAuth()
```

### 4. Providers Expose an API, Not State Internals

Providers should expose intent-based methods, not implementation details.

✅ Good:

```ts
login()
logout()
refreshAuth()
```

❌ Bad:

```ts
setUser()
setSession()
```

## Standard Provider Structure

All providers follow the same folder pattern:

```ts
providers/
└── auth/
    ├── AuthContext.ts  // Creates context
    ├── AuthProvider.tsx  // Owns state, side effect, and api implementation
    └── useAth.ts  // The ONLY way to access the provider
```

### When to Create a Provider

#### **Create a provider when:**

✅ Multiple components need the same state

✅ State must persist across routes

✅ Logic is not tied to a single component

✅ Side effects need central control


**_Do not create a provider for:_**
- _Local UI state_
- _One-off component logic_
- _Simple prop passing_



####  **Anti-Patterns to Avoid:**

❌ Using context without a hook

❌ Mutating provider state outside provider

❌ Overloading a provider with multiple concerns

❌ Making providers depend on each other directly

## Summary

Providers in this project:

- Are predictable
- Are typed
- Are safe by default
- Scale with the app












