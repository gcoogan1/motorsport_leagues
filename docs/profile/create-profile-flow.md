# Create Profile Flow

## Steps

### Part 1: Game Selection

1. **Navigate to Create Profile**
   - User goes to `/create-profile`
   - Flow controller lives in [src/pages/CreateProfile/CreateProfile.tsx](src/pages/CreateProfile/CreateProfile.tsx)

2. **Select Game Type**
   - User selects a game (default: `gt7`)
   - Valid games are defined by `GAME_TYPES` in [src/types/profile.types.ts](src/types/profile.types.ts)
   - Form validation uses Zod enum in [src/features/profiles/forms/Create/Game/gameSchema.ts](src/features/profiles/forms/Create/Game/gameSchema.ts)

3. **Draft Stored**
   - Draft data is stored in Redux via `updateProfileDraft`
   - Draft is cleared on mount via `clearProfileDraft`
   - Logic in [src/store/profile/profile.slice.ts](src/store/profile/profile.slice.ts)

---

### Part 2: Username Selection

4. **Enter Username**
   - User enters a username based on selected game type
   - Validation rules:
     - **GT7:** 1–16 characters, trimmed and lowercased
     - **iRacing (future):** min 3 characters
   - Validation in [src/features/profiles/forms/Create/Username/usernameSchema.ts](src/features/profiles/forms/Create/Username/usernameSchema.ts)

5. **Check Availability**
   - System calls `isProfileUsernameAvailable`
   - If existing username:
     - Shows “Existing Username” modal
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

6. **Draft Stored**
   - On success, username is added to draft
   - Logic in [src/features/profiles/forms/Create/Username/Username.tsx](src/features/profiles/forms/Create/Username/Username.tsx)

---

### Part 3: Avatar Selection & Create

7. **Choose Avatar**
   - User selects either:
     - **Preset** (from `AVATAR_VARIANTS`)
     - **Upload** (file max 5MB)
   - Validation in [src/features/profiles/forms/Create/Avatar/avatarFormSchema.ts](src/features/profiles/forms/Create/Avatar/avatarFormSchema.ts)

8. **Create Profile**
   - Submit creates a profile via `createProfileThunk`
   - Payload uses `accountId`, `gameType`, `username`, and avatar
   - Thunk in [src/store/profile/profile.thunk.ts](src/store/profile/profile.thunk.ts)

9. **Storage + Insert**
   - If avatar is upload:
     - File is uploaded to Supabase Storage `avatars` bucket
     - Path format: `{accountId}/{uuid}.{ext}`
   - Profile inserted into `profiles` table
   - Avatar URL is resolved to public URL before returning
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

10. **Success**
   - Draft is cleared
   - User navigates to `/profile/{id}`
   - “Profile Created” success modal is shown
   - Flow ends in [src/features/profiles/forms/Create/Avatar/AvatarForm.tsx](src/features/profiles/forms/Create/Avatar/AvatarForm.tsx)

---

## Potential Issues/Edge Cases

### Username Step

- **Existing Username**
  - Code: `EXISTING_USERNAME`
  - Shows “Existing Username” modal
  - User stays on username step

- **Validation Error**
  - Inline form errors shown
  - No API call until validation passes

### Avatar Step

- **Upload Too Large**
  - Max 5MB
  - Inline validation error

- **Upload Failure**
  - Code: `UPLOAD_FAILED`
  - Generic error modal via `handleSupabaseError`

- **Profile Creation Failure**
  - Code: `PROFILE_CREATION_FAILED`
  - Generic error modal via `handleSupabaseError`

### General Errors

- **Missing Account**
  - Throws `SERVER_ERROR` before create
  - Handled by `handleSupabaseError`
  - Logic in [src/features/profiles/forms/Create/Avatar/AvatarForm.tsx](src/features/profiles/forms/Create/Avatar/AvatarForm.tsx)

---

## Key Implementation Details

- Draft state stored in Redux (`state.profile.draft`)
- Draft cleared on flow start and after success
- Minimum 1-second delay (`withMinDelay`) for UX consistency
- Username availability checked before progressing to avatar
- Profile creation returns avatar URL in resolved form for rendering
- Navigation and success modal triggered after successful create

---

## Summary

Create Profile is a 3-step flow:

1. Select Game
2. Choose Username
3. Pick Avatar and Create

All form state is validated with Zod, draft is tracked in Redux, and final creation is handled through Supabase with optional avatar uploads.