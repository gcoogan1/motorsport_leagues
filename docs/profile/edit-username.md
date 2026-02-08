# Edit Username Flow

## Steps

### Part 1: Open Edit Username

1. **Open Profile Edit Panel**
   - User opens the profile edit panel from a profile
   - Panel entry point in [src/features/panels/profileEdit/ProfileEdit.tsx](src/features/panels/profileEdit/ProfileEdit.tsx)

2. **Launch Edit Username Modal**
   - User clicks “Username”
   - Modal opens with `EditUsername` form
   - Logic in [src/features/panels/profileEdit/forms/EditUsername/EditUsername.tsx](src/features/panels/profileEdit/forms/EditUsername/EditUsername.tsx)

---

### Part 2: Validation & Availability

3. **Prefill Current Username**
   - Form default value set to current username
   - Schema chosen based on `game_type`
   - Schema in [src/features/panels/profileEdit/forms/EditUsername/editUsername.schema.ts](src/features/panels/profileEdit/forms/EditUsername/editUsername.schema.ts)

4. **Validate Username**
   - Zod validation runs on submit
   - Rules depend on game type
   - Inline errors shown on failure

5. **Check Availability**
   - Calls `isProfileUsernameAvailable`
   - If username exists:
     - Shows “Existing Username” modal
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

---

### Part 3: Save & Update

6. **Submit Update**
   - Dispatches `updateProfileUsernameThunk`
   - Thunk in [src/store/profile/profile.thunk.ts](src/store/profile/profile.thunk.ts)

7. **Update Profile**
   - Updates `profiles` table
   - Avatar URL is preserved/resolved before returning
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

8. **Success**
   - Redux updates `currentProfile` and list
   - Success toast: “Profile's Username updated.”
   - Modal closes
   - Logic in [src/store/profile/profile.slice.ts](src/store/profile/profile.slice.ts)

---

## Potential Issues/Edge Cases

### Username Step

- **Existing Username**
  - Code: `EXISTING_USERNAME`
  - Shows “Existing Username” modal
  - User stays in modal

- **Validation Error**
  - Inline error messaging shown
  - No API call until valid

### Update Errors

- **Update Failure**
  - Code: `USERNAME_UPDATE_FAILED`
  - Generic error modal via `handleSupabaseError`

- **Server Error**
  - Generic error modal via `handleSupabaseError`

---

## Key Implementation Details

- Form uses `react-hook-form` + Zod
- Schema is game-specific
- Username availability check happens before update
- Redux state updates keep profile list and current profile in sync
- Success toast + modal close on completion

---

## Summary

Edit Username is a modal flow that:

1. Prefills the current username
2. Validates input by game type
3. Confirms availability
4. Updates the profile and syncs Redux state
5. Shows a success toast and closes the modal