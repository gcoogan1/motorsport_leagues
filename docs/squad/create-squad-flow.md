# Create Squad Flow

## Steps

### Part 1: Open Create Squad

1. **Navigate to Create Squad**
   - User goes to `/create-squad`
   - Flow controller lives in [src/pages/CreateSquad/CreateSquad.tsx](src/pages/CreateSquad/CreateSquad.tsx)

2. **Draft Cleared on Mount**
   - Existing squad draft is cleared via `clearSquadDraft`
   - Prevents stale founder/name values from previous attempts
   - Logic in [src/pages/CreateSquad/CreateSquad.tsx](src/pages/CreateSquad/CreateSquad.tsx)

3. **Profile Requirement Check**
   - If user has no active profiles, flow shows `NoProfileForm`
   - Continue action navigates to `/create-profile`
   - Logic in [src/features/squads/forms/Create/NoProfile/NoProfileForm.tsx](src/features/squads/forms/Create/NoProfile/NoProfileForm.tsx)

---

### Part 2: Founder Selection

4. **Select Founder Profile**
   - Step component: `Founder`
   - User picks which profile will be founder
   - Component in [src/features/squads/forms/Create/Founder/Founder.tsx](src/features/squads/forms/Create/Founder/Founder.tsx)

5. **Validate Founder**
   - Requires a non-empty founder profile ID
   - Schema in [src/features/squads/forms/Create/Founder/founderSchema.ts](src/features/squads/forms/Create/Founder/founderSchema.ts)

6. **Store Draft Founder**
   - Saves `founder_profile_id` to Redux draft via `updateSquadDraft`
   - Moves to next step on success
   - State logic in [src/store/squads/squad.slice.ts](src/store/squads/squad.slice.ts)

---

### Part 3: Squad Name Selection

7. **Enter Squad Name**
   - Step component: `Name`
   - User enters squad name (max 64 chars)
   - Component in [src/features/squads/forms/Create/Name/Name.tsx](src/features/squads/forms/Create/Name/Name.tsx)

8. **Validate Name**
   - Requires non-empty value, max 64 characters
   - Schema in [src/features/squads/forms/Create/Name/nameSchema.ts](src/features/squads/forms/Create/Name/nameSchema.ts)

9. **Check Availability**
   - Calls `isSquadNameAvailable`
   - Name check uses normalized value via `normalizeName`
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

10. **Store Draft Name**
    - Saves `squad_name` to Redux draft
    - Moves to banner step
    - Logic in [src/features/squads/forms/Create/Name/Name.tsx](src/features/squads/forms/Create/Name/Name.tsx)

---

### Part 4: Banner Selection & Create

11. **Choose Banner**
    - Step component: `Banner`
    - User selects:
      - **Preset** (`SQUAD_BANNER_VARIANTS`)
      - **Upload** (JPG/PNG up to 5MB)
    - Schema in [src/features/squads/forms/Create/Banner/bannerSchema.ts](src/features/squads/forms/Create/Banner/bannerSchema.ts)

12. **Submit Create Request**
    - Dispatches `createSquadThunk`
    - Payload includes `founderAccountId`, `founderProfileId`, `squadName`, and banner
    - Thunk in [src/store/squads/squad.thunk.ts](src/store/squads/squad.thunk.ts)

13. **Storage + Insert + Founder Membership**
    - If upload: banner is uploaded to Supabase `banners` bucket
    - Creates row in `squads`
    - Adds founder to `squad_members` with `role: "founder"`
    - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

14. **Success**
    - Draft is cleared
    - User navigates to `/squad/{id}`
    - Success modal `SquadCreated` is shown
    - Flow end in [src/features/squads/forms/Create/Banner/Banner.tsx](src/features/squads/forms/Create/Banner/Banner.tsx)

---

## Potential Issues/Edge Cases

### Access Prerequisites

- **No Profile Available**
  - User cannot create squad without a profile
  - Redirect path offered to `/create-profile`

### Name Step

- **Name Taken**
  - Code: `NAME_TAKEN`
  - Error modal shown via `handleSupabaseError`

- **Validation Error**
  - Inline form error shown
  - No availability API call until valid

### Banner/Create Step

- **Upload Too Large**
  - Max 5MB validation failure

- **Upload Failure**
  - Code: `UPLOAD_FAILED`

- **Create Failure**
  - Service returns failure (fallback code currently may surface as `PROFILE_CREATION_FAILED`)

- **Founder Member Insert Failure**
  - Service attempts cleanup (delete created squad and uploaded banner)

---

## Key Implementation Details

- Multi-step flow state controlled in `CreateSquad.tsx`
- Draft stored in Redux `state.squad.draft`
- All forms use `react-hook-form` + Zod
- `withMinDelay(1000)` used for consistent loading UX
- Banner upload paths use account-scoped folder format `{accountId}/{uuid}.{ext}`

---

## Summary

Create Squad is a 3-step flow:

1. Choose Founder Profile
2. Pick Squad Name
3. Select Banner and Create

State is drafted in Redux, validated with Zod, and persisted through Supabase (including optional banner upload and founder membership creation).
