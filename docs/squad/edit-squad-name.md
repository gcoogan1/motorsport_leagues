# Edit Squad Name Flow

## Steps

### Part 1: Open Edit Name

1. **Open Squad Edit Panel**
   - Founder opens squad edit panel
   - Panel entry point in [src/features/panels/squadEdit/SquadEdit.tsx](src/features/panels/squadEdit/SquadEdit.tsx)

2. **Launch Edit Squad Name Modal**
   - User clicks “Squad Name”
   - Modal opens with `EditSquadName`
   - Logic in [src/features/panels/squadEdit/forms/EditSquadName/EditSquadName.tsx](src/features/panels/squadEdit/forms/EditSquadName/EditSquadName.tsx)

---

### Part 2: Validation & Availability

3. **Prefill Current Name**
   - Form default is current squad name
   - Pulls from `state.squad.currentSquad`

4. **Validate Name**
   - Requires non-empty value, max 64 characters
   - Schema in [src/features/panels/squadEdit/forms/EditSquadName/editSquadName.schema.ts](src/features/panels/squadEdit/forms/EditSquadName/editSquadName.schema.ts)

5. **Check Name Availability**
   - Calls `isSquadNameAvailable(data.name, currentSquad.id)`
   - Current squad ID is excluded, allowing same-name/capitalization updates
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

---

### Part 3: Save & Update

6. **Submit Update**
   - Dispatches `editSquadNameThunk`
   - Thunk in [src/store/squads/squad.thunk.ts](src/store/squads/squad.thunk.ts)

7. **Persist to Database**
   - Updates `squads.squad_name`
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

8. **Success**
   - Success toast: “Squad Name updated.”
   - Modal closes
   - Flow in [src/features/panels/squadEdit/forms/EditSquadName/EditSquadName.tsx](src/features/panels/squadEdit/forms/EditSquadName/EditSquadName.tsx)

---

## Potential Issues/Edge Cases

### Name Validation

- **Empty Name**
  - Inline validation error

- **Name Too Long**
  - Max length error at 64 characters

- **Name Taken**
  - Code: `NAME_TAKEN`
  - Error modal shown via `handleSupabaseError`

### Update Errors

- **Generic Server Error**
  - Code path falls back to `SERVER_ERROR`
  - Generic error modal shown

---

## Key Implementation Details

- Form powered by `react-hook-form` + Zod
- Availability check runs before dispatching update thunk
- Name uniqueness uses normalized matching in service layer
- Includes `withMinDelay(1000)` for consistent loading UX

---

## Summary

Edit Squad Name is a modal flow that:

1. Prefills current squad name
2. Validates and checks availability
3. Updates the squad name
4. Shows a success toast and closes the modal
