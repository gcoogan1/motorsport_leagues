# Logout Flow

## Steps

1. **Navigate to Account Panel**
   - User clicks account icon or navigates to account settings
   - Account panel opens displaying user information

2. **Initiate Logout**
   - User scrolls to bottom of Account panel
   - "Log Out" option displayed with helper text: "See You Later!"
   - Logout icon indicates the action
   - User clicks on "Log Out" option

3. **Logout Process**
   - Account panel closes immediately via `closePanel()`
   - System calls `resetAuth()` from AuthProvider
   - `resetAuth()` internally calls `logoutUser()` service function
   - Supabase `auth.signOut()` invoked with `scope: "local"`
     - **Local scope**: Clears session from current device only
     - Other devices/browsers remain logged in
     - Other sessions unaffected (can still use their tokens)
   - Local state is cleared after signOut
   - User redirected to home page via `navigate("/")`

4. **Handle Auth Session Errors**
   - If `Auth session missing!` error occurs during signOut:
     - Error is caught and treated as success
     - Session already cleared/expired
     - Local state cleanup still proceeds
   - For other errors:
     - Returns error with code and status
     - Error logged to console
     - Navigation still proceeds

5. **Clear Authentication State (resetAuth)**
   - Calls `logoutUser()` which invokes Supabase signOut
   - Auth provider resets all local auth-related state:
     - User set to null
     - Session set to null
     - isVerified set to false
     - Loading set to false
   - Redux store maintains current state (not cleared)

6. **Auth State Change Propagation**
   - `onAuthStateChange` listener in AuthProvider detects logout
   - Triggers `refreshAuth()` which updates all auth context consumers
   - Protected routes become inaccessible immediately
   - Components using `useAuth()` re-render with null user/session

7. **Logout Success**
   - User immediately logged out on current device only
   - Other browsers/devices remain logged in (local scope)
   - Auth context updated to unauthenticated state on current device
   - User redirected to home page (`/`)
   - No confirmation modal or toast notification

## Potential Issues/Edge Cases

### During Logout (Step 3-5)

- **Auth Session Missing**
  - Error message: "Auth session missing!"
  - Occurs when session already cleared/expired
  - Treated as successful logout (returns `success: true`)
  - Local state cleanup proceeds normally
  - No user-facing error shown

- **Logout Fails (Network/Server Error)**
  - Code: `SERVER_ERROR` or specific error code
  - Status: 500 or error-specific status
  - Error logged to console: "Logout failed: {error}"
  - Navigation to home page still proceeds
  - Local auth state cleared
  - User may still be logged in server-side but appears logged out locally

- **Network Errors**
  - Connection issues during Supabase signOut call
  - Error caught in try/catch block
  - Logged to console
  - User still navigated to home page
  - Local state cleared regardless of server outcome

### General Considerations

- **No Confirmation Required**
  - Single-click logout without confirmation dialog
  - User can immediately log back in if accidental

- **Local Scope: Single Device Only**
  - Only current device/browser logged out
  - Other browsers/devices remain fully logged in
  - Their tokens/sessions unaffected
  - They can continue using the app normally
  - No cross-device logout or notification

- **Session Cleanup**
  - Server-side session terminated via Supabase (local scope)
  - Local storage/cookies cleared by Supabase SDK on current device
  - Auth state change listeners triggered on current device only

## Key Implementation Details

- Panel closes before logout operation completes via `closePanel()`
- Logout operation is async but doesn't block navigation
- Uses async/await with try/catch for error handling
- Error handling logs to console but doesn't block user flow
- Navigation to home always executes (even on logout failure)
- `resetAuth()` calls `logoutUser()` and clears local state
- `onAuthStateChange` listener in AuthProvider propagates state changes
- No minimum delay - logout happens immediately
- Redux account/profile stores not cleared (will be cleared on next login)
- Local scope only affects current device (no cross-device impact)

## Security Features

- **Local scope logout**: Only current device/browser affected
- Server-side session termination via Supabase (local scope)
- Local auth state completely cleared on logout device
- Auth state change propagated on current device via `onAuthStateChange`
- Protected routes immediately inaccessible on logout device
- Idempotent logout (safe to call multiple times)
- Handles already-expired sessions gracefully
- No stale session data persists locally

### Cross-Device Security Notes
- Local scope means other devices keep their sessions
- Other users can't login to other device's sessions (tied to tokens)
- Each device manages its own auth state independently
- If global logout needed, change `scope: "local"` to `scope: "global"` in code

## UI/UX Features

- Single-click logout (no confirmation)
- Panel closes immediately for instant feedback
- Helper text "See You Later!" provides friendly tone
- Logout icon clearly indicates action
- Positioned at bottom of account panel for accessibility
- No loading state shown (instant action)
- No success toast or confirmation modal
- Silent operation unless error occurs

## Auth Provider Integration

### logoutUser() Service
- Located in `src/services/auth.service.ts`
- Calls Supabase `auth.signOut({ scope: "local" })`
- Handles "Auth session missing!" error gracefully
- Returns success even if session already cleared
- Returns error for genuine network/server failures

### resetAuth() Provider Method
- Located in `src/providers/auth/AuthProvider.tsx`
- Calls `logoutUser()` first
- Then clears local auth state:
  - Sets user to null
  - Sets session to null
  - Sets isVerified to false
  - Sets loading to false
- Used for logout and hard resets

### AccountPanel handleLogout()
- Located in `src/features/panels/account/AccountPanel.tsx`
- Closes panel immediately: `closePanel()`
- Calls `resetAuth()` for logout and state cleanup
- Navigates to home: `navigate("/")`
- Errors logged to console but don't block flow
- No explicit `logoutUser()` call (called via `resetAuth()`)

### Auth State Listeners
- `onAuthStateChange` in AuthProvider detects session changes
- Automatically triggers `refreshAuth()` when logout detected
- Propagates auth state updates to all components using `useAuth()`
- No manual intervention needed - reactive state management