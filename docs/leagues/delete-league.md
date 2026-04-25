# Delete League Flow

## Steps

### Part 1: Open Delete League

1. **Navigate to League Management**
   - Director navigates to `/league/{leagueId}/management`
   - Page controller in [src/pages/LeagueManagement/LeagueManagment.tsx](src/pages/LeagueManagement/LeagueManagment.tsx)

2. **Open League Settings Section**
   - Director selects the "League Settings" section from the management menu
   - Active sheet renders the `Settings` form
   - Logic in [src/pages/LeagueManagement/LeagueManagment.tsx](src/pages/LeagueManagement/LeagueManagment.tsx)

3. **Click Delete League**
   - A "Delete League" button is shown at the bottom of the Settings form
   - Clicking opens the `DeleteLeague` confirmation form modal
   - Form in [src/features/leagues/forms/DeleteLeague/DeleteLeague.tsx](src/features/leagues/forms/DeleteLeague/DeleteLeague.tsx)

---

### Part 2: Confirm Deletion

4. **Confirmation Phrase Required**
   - User must type the league name exactly to confirm
   - Schema validates against the current league name
   - Schema in [src/features/leagues/forms/DeleteLeague/confirmDeleteLeague.schema.ts](src/features/leagues/forms/DeleteLeague/confirmDeleteLeague.schema.ts)

5. **Submit Deletion**
   - Dispatches `deleteLeagueThunk(currentLeague.id)`
   - Thunk in [src/store/leagues/league.thunk.ts](src/store/leagues/league.thunk.ts)

---

### Part 3: Cleanup & Navigation

6. **Cover Cleanup (If Uploaded)**
   - If the league cover is type `upload`, the file is removed from Supabase storage
   - Service in [src/services/league.service.ts](src/services/league.service.ts)

7. **Relational Cleanup**
   - Deletes related rows in `league_follows`
   - Deletes related rows in `league_participants`
   - Deletes related rows in `league_join_requests`
   - Deletes related rows in `league_season`
   - Deletes related rows in `league_application_options`
   - Then deletes the row from `leagues`
   - Service in [src/services/league.service.ts](src/services/league.service.ts)

8. **UI Updates**
   - User navigates to `/`
   - Modal closes
   - Success toast: "League has been deleted."
   - Flow end in [src/features/leagues/forms/DeleteLeague/DeleteLeague.tsx](src/features/leagues/forms/DeleteLeague/DeleteLeague.tsx)

---

## Potential Issues/Edge Cases

### Access Rules

- **Non-Director**
  - Delete option is only available in the management sheet, which is only accessible to directors

### Validation

- **Incorrect Confirmation Phrase**
  - Inline validation error shown
  - No delete request is sent until phrase matches exactly

### Deletion Errors

- **Server Error**
  - `CannotSave` error modal shown
  - No navigation occurs
