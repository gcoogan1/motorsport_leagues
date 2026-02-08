# Delete Profile Flow

## Steps

### Part 1: Open Delete Profile

1. **Open Profile Edit Panel**
   - User opens the profile edit panel from a profile
   - Panel entry point in [src/features/panels/profileEdit/ProfileEdit.tsx](src/features/panels/profileEdit/ProfileEdit.tsx)

2. **Launch Delete Profile Modal**
   - User clicks “Delete Profile”
   - Modal opens with `DeleteProfile` form
   - Logic in [src/features/panels/profileEdit/forms/DeleteProfile/DeleteProfile.tsx](src/features/panels/profileEdit/forms/DeleteProfile/DeleteProfile.tsx)

---

### Part 2: Confirm Deletion

3. **Confirm Phrase Required**
   - User must type **“delete profile”** to confirm
   - Validation via Zod schema
   - Schema in [src/features/panels/profileEdit/forms/DeleteProfile/confirmDeleteProfile.schema.ts](src/features/panels/profileEdit/forms/DeleteProfile/confirmDeleteProfile.schema.ts)

4. **Submit Deletion**
   - Dispatches `deleteProfileThunk`
   - Thunk in [src/store/profile/profile.thunk.ts](src/store/profile/profile.thunk.ts)

---

### Part 3: Delete & Cleanup

5. **Avatar Cleanup (If Upload)**
   - If avatar is uploaded, storage file is removed
   - Uses `deleteAvatarFromStorage`
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

6. **Profile Deletion**
   - Profile row deleted from `profiles` table
   - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

7. **State Updates**
   - Profile removed from Redux list
   - Current profile handling depends on slice logic
   - State updates in [src/store/profile/profile.slice.ts](src/store/profile/profile.slice.ts)

8. **Navigation + UI**
   - Flow navigates back to `/`
   - Modal closes and panel closes
   - Flow in [src/features/panels/profileEdit/forms/DeleteProfile/DeleteProfile.tsx](src/features/panels/profileEdit/forms/DeleteProfile/DeleteProfile.tsx)

---

## Potential Issues/Edge Cases

### Validation

- **Missing or incorrect confirmation**
  - Inline validation error
  - No delete call is made

### Deletion Errors

- **Avatar Deletion Failed**
  - Code: `AVATAR_DELETION_FAILED`
  - Generic error modal via `handleSupabaseError`

- **Profile Deletion Failed**
  - Code: `PROFILE_DELETION_FAILED`
  - Generic error modal via `handleSupabaseError`

---

## Key Implementation Details

- Delete is blocked until confirmation phrase matches
- Avatar files are deleted only for uploaded avatars
- Redux list is kept in sync after deletion
- Modal and panel are closed on completion

---

## Summary

Delete Profile is a confirmed modal flow that:

1. Requires a typed confirmation
2. Deletes avatar storage if applicable
3. Deletes the profile row
4. Syncs Redux state and navigates away