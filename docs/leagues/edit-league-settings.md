# Edit League Settings Flow

## Steps

### Part 1: Open League Settings

1. **Navigate to League Management**
   - Director navigates to `/league/{leagueId}/management`
   - Page controller in [src/pages/LeagueManagement/LeagueManagment.tsx](src/pages/LeagueManagement/LeagueManagment.tsx)

2. **Select League Settings Section**
   - Director selects "League Settings" from the management menu
   - Active sheet renders the `Settings` form
   - Form in [src/features/leagues/forms/Edit/Settings/Settings.tsx](src/features/leagues/forms/Edit/Settings/Settings.tsx)

3. **Form Hydration**
   - Settings form pre-populates from `currentLeague` in Redux state
   - Fields include: league name, cover image, theme color, timezone, description
   - Hydration utilities in [src/features/leagues/forms/Edit/Settings/Settings.util.ts](src/features/leagues/forms/Edit/Settings/Settings.util.ts)

---

### Part 2: Edit Settings Fields

4. **Editable Fields**
   - **League Name**: text input; checked for availability on change
   - **Cover Image**: preset graphic selector or image upload
   - **Theme Color**: preset color selector
   - **Timezone**: dropdown with searchable timezone options; current league timezone prepended if not in base list
   - **Description**: textarea

5. **Validate Changes**
   - Schema enforces required fields and character limits
   - Schema in [src/features/leagues/forms/Edit/Settings/settingsSchema.ts](src/features/leagues/forms/Edit/Settings/settingsSchema.ts)

6. **Dirty / Unsaved Changes Guard**
   - Form tracks `isDirty` state via `onDirtyChange` callback
   - If user attempts to navigate away with unsaved changes, `UnsavedChanges` modal opens
   - Modal in [src/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges.tsx](src/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges.tsx)

---

### Part 3: Save Settings

7. **Submit Update**
   - Save button shows loading state (`isSaving` / `saveLoadingText`) during submission via `formState.isSubmitting`
   - Dispatches `updateLeagueThunk` with changed fields
   - Thunk in [src/store/leagues/league.thunk.ts](src/store/leagues/league.thunk.ts)

8. **Cover Upload (If Changed)**
   - If new cover is type `upload`, image is uploaded to Supabase `covers` bucket
   - Old uploaded cover is removed if replaced
   - Service in [src/services/league.service.ts](src/services/league.service.ts)

9. **Persist League Row**
   - Updates `leagues` table with changed fields
   - Dispatches `getLeagueByIdThunk` afterwards to refresh Redux state
   - Service in [src/services/league.service.ts](src/services/league.service.ts)

10. **Success**
    - Success toast: "League settings updated."
    - Form resets dirty state

---

### Part 4: Unsaved Changes

11. **Navigate Away with Unsaved Changes**
    - If `hasUnsavedChanges` is true and user switches section or navigates, `UnsavedChanges` modal opens
    - Modal in [src/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges.tsx](src/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges.tsx)

12. **Cannot Save Modal**
    - If the league name has been taken during editing, `CannotSave` error modal opens on submit
    - Modal in [src/features/leagues/modals/errors/CannotSave/CannotSave.tsx](src/features/leagues/modals/errors/CannotSave/CannotSave.tsx)

---

## Potential Issues/Edge Cases

### Access Rules

- **Non-Director**
  - Management page is a protected route; only accessible to directors

### Name Validation

- **League Name Already Taken**
  - `CannotSave` modal shown on submit
  - No update is persisted

### Cover Upload Errors

- **Upload Too Large or Invalid Format**
  - Inline validation error from `ImageUploadInput`
  - Form not submitted
