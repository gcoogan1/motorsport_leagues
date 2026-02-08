# Edit Avatar Flow

## Steps

### Part 1: Open Edit Avatar

1. **Open Profile Edit Panel**
   - User opens the profile edit panel from a profile
   - Panel entry point in [src/features/panels/profileEdit/ProfileEdit.tsx](src/features/panels/profileEdit/ProfileEdit.tsx)

2. **Launch Edit Avatar Modal**
   - User clicks “Avatar Image”
   - Modal opens with `EditAvatar` form
   - Logic in [src/features/panels/profileEdit/forms/EditAvatar/EditAvatar.tsx](src/features/panels/profileEdit/forms/EditAvatar/EditAvatar.tsx)

---

### Part 2: Form Prefill & Selection

3. **Prefill Current Avatar**
   - If current avatar is a preset:
     - Form preloads the preset variant
   - If current avatar is an upload:
     - Form sets a `previewUrl` for display (no File yet)
   - Prefill logic in [src/features/panels/profileEdit/forms/EditAvatar/EditAvatar.tsx](src/features/panels/profileEdit/forms/EditAvatar/EditAvatar.tsx)

4. **Select New Avatar**
   - User selects either:
     - **Preset** from `AVATAR_VARIANTS`
     - **Upload** (File max 5MB)
   - Validation in [src/features/panels/profileEdit/forms/EditAvatar/editAvatar.schema.ts](src/features/panels/profileEdit/forms/EditAvatar/editAvatar.schema.ts)

---

### Part 3: Save & Update

5. **Submit Update**
   - Form submits `updateProfileAvatarThunk`
   - Thunk in [src/store/profile/profile.thunk.ts](src/store/profile/profile.thunk.ts)

6. **Storage + Update**
   - If avatar is upload:
     - File uploaded to Supabase Storage `avatars` bucket
     - Path format: `{accountId}/{uuid}.{ext}`
   - Profile updated in `profiles` table
   - Avatar URL resolved to public URL before returning
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

7. **Success**
   - Redux state updates `currentProfile` and list
   - Success toast shows: “Profile’s Avatar updated.”
   - Modal closes
   - Logic in [src/store/profile/profile.slice.ts](src/store/profile/profile.slice.ts)

---

## Potential Issues/Edge Cases

### Avatar Selection

- **Upload Too Large**
  - Max 5MB
  - Inline validation error

- **Invalid File**
  - Fails Zod schema check

### Update Errors

- **Upload Failure**
  - Code: `AVATAR_UPLOAD_FAILED`
  - Generic error modal via `handleSupabaseError`

- **Update Failure**
  - Code: `AVATAR_UPDATE_FAILED`
  - Generic error modal via `handleSupabaseError`

---

## Key Implementation Details

- Form is powered by `react-hook-form` + Zod
- For uploads, the form stores `previewUrl` only until a File is selected
- Avatar URL is always resolved to a public URL before saving to Redux
- State updates propagate to both `currentProfile` and `data` list

---

## Summary

Edit Avatar is a modal flow that:

1. Prefills the current avatar
2. Lets the user choose a preset or upload a new image
3. Uploads the file if needed, updates the profile, and syncs state
4. Shows a success toast and closes the modal