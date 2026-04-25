# Create League Flow

## Steps

### Part 1: Open Create League

1. **Navigate to Create League**
   - User goes to `/create-league`
   - Flow controller lives in [src/pages/CreateLeague/CreateLeague.tsx](src/pages/CreateLeague/CreateLeague.tsx)

2. **Draft Cleared on Mount**
   - Existing league draft is cleared via `clearLeagueDraft`
   - Prevents stale values from previous attempts
   - Logic in [src/pages/CreateLeague/CreateLeague.tsx](src/pages/CreateLeague/CreateLeague.tsx)

3. **Profile Requirement Check**
   - If user has no active profiles, flow shows `ProfileRequiredForm`
   - Continue action navigates to `/create-profile`
   - Component in [src/features/leagues/forms/Create/ProfileRequired/ProfileRequired.tsx](src/features/leagues/forms/Create/ProfileRequired/ProfileRequired.tsx)

4. **Squad Requirement Check**
   - If user has no squads, flow shows `SquadRequiredForm`
   - Continue action navigates to `/create-squad`
   - Component in [src/features/leagues/forms/Create/SquadRequired/SquadRequired.tsx](src/features/leagues/forms/Create/SquadRequired/SquadRequired.tsx)

---

### Part 2: Director Selection

5. **Select Director Profile**
   - Step component: `Director`
   - User picks which of their profiles will direct the league
   - Component in [src/features/leagues/forms/Create/Director/Director.tsx](src/features/leagues/forms/Create/Director/Director.tsx)

6. **Validate Director**
   - Requires a non-empty director profile ID
   - Schema in [src/features/leagues/forms/Create/Director/directorSchema.ts](src/features/leagues/forms/Create/Director/directorSchema.ts)

7. **Squad Membership Check**
   - Fetches squads for the selected director via `useSquadsByProfileId`
   - If director belongs to no squad, shows `NoSquad` error modal
   - Director must belong to a squad before proceeding
   - Logic in [src/features/leagues/forms/Create/Director/Director.tsx](src/features/leagues/forms/Create/Director/Director.tsx)

8. **Store Draft Director**
   - Saves `director_profile_id` and `game_type` to Redux draft via `updateLeagueDraft`
   - Moves to host step on success
   - State logic in [src/store/leagues/league.slice.ts](src/store/leagues/league.slice.ts)

---

### Part 3: Host & League Name

9. **Enter League Name & Select Hosting Squad**
   - Step component: `Host`
   - User enters the league name and selects which of the director's squads will host
   - Component in [src/features/leagues/forms/Create/Host/Host.tsx](src/features/leagues/forms/Create/Host/Host.tsx)

10. **Validate Host Details**
    - Requires non-empty league name and a selected hosting squad
    - Schema in [src/features/leagues/forms/Create/Host/hostSchema.ts](src/features/leagues/forms/Create/Host/hostSchema.ts)

11. **Check League Name Availability**
    - Calls `isLeagueNameAvailable` with normalized value
    - Shows inline error if name is taken
    - Service in [src/services/league.service.ts](src/services/league.service.ts)

12. **Store Draft Host Details**
    - Saves `league_name`, `hosting_squad_id`, and `hosting_squad_name` to Redux draft
    - Moves to cover step
    - Logic in [src/features/leagues/forms/Create/Host/Host.tsx](src/features/leagues/forms/Create/Host/Host.tsx)

---

### Part 4: Cover & Theme

13. **Choose Cover & Theme Color**
    - Step component: `CoverForm`
    - User selects:
      - **Preset** cover graphic
      - **Upload** (custom image)
    - User also selects a theme color
    - Component in [src/features/leagues/forms/Create/Cover/CoverForm.tsx](src/features/leagues/forms/Create/Cover/CoverForm.tsx)

14. **Validate Cover Selection**
    - Requires a valid cover and theme color
    - Schema in [src/features/leagues/forms/Create/Cover/coverFormSchema.tsx](src/features/leagues/forms/Create/Cover/coverFormSchema.tsx)

15. **Store Draft Cover Details**
    - Saves `cover_image` and `theme_color` to Redux draft
    - Moves to season step
    - Logic in [src/features/leagues/forms/Create/Cover/CoverForm.tsx](src/features/leagues/forms/Create/Cover/CoverForm.tsx)

---

### Part 5: Season Setup & Create

16. **Configure First Season**
    - Step component: `Season`
    - User enters:
      - **Season name** (defaults to "Season 1")
      - **Number of divisions** (1–5)
      - **Team championship** toggle
    - Component in [src/features/leagues/forms/Create/Season/Season.tsx](src/features/leagues/forms/Create/Season/Season.tsx)

17. **Validate Season Details**
    - Schema in [src/features/leagues/forms/Create/Season/seasonSchema.ts](src/features/leagues/forms/Create/Season/seasonSchema.ts)

18. **Submit Create Request**
    - Dispatches `createLeagueThunk` with full draft payload including `accountId`
    - Thunk in [src/store/leagues/league.thunk.ts](src/store/leagues/league.thunk.ts)

19. **Storage + Insert + Director Membership + Application Options**
    - If upload cover: image is uploaded to Supabase `covers` bucket
    - Creates row in `leagues`
    - Creates initial season row in `league_seasons`
    - Adds the director as a participant with role `director`
    - Creates default row in `league_application_options` with:
      - `open_roles`: `driver`, `steward`, `broadcaster`, `staff`
      - `contact_info`: `true`
      - `is_closed`: `false`
    - Service in [src/services/league.service.ts](src/services/league.service.ts)

20. **Success**
    - Opens `LeagueCreated` success modal
    - Navigates to `/league/{leagueId}`
    - Modal in [src/features/leagues/modals/success/LeagueCreated/LeagueCreated.tsx](src/features/leagues/modals/success/LeagueCreated/LeagueCreated.tsx)

---

## Potential Issues/Edge Cases

### Access Rules

- **No Profile**
  - Flow shows `ProfileRequiredForm` before any steps
  - Redirect to `/create-profile`

- **No Squad**
  - Flow shows `SquadRequiredForm` before any steps
  - Redirect to `/create-squad`

### Director Eligibility

- **Director Not in a Squad**
  - `NoSquad` modal opens
  - User cannot proceed until they belong to a squad

### Name Validation

- **League Name Already Taken**
  - Inline error shown on Host step
  - No draft update until name is available

### Post-Create Defaults

- **Application Options Created Automatically**
  - New leagues start with default open roles and join contact info enabled
  - These defaults can be changed later from Participant Roles management
