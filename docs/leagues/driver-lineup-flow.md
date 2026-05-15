# Driver Lineup Flow

## Steps

### Part 1: Open League Lineup

1. **Navigate to League Page**
   - User opens `/league/{leagueId}`
   - Page controller in [src/pages/League/League.tsx](src/pages/League/League.tsx)

2. **Resolve Active Season**
   - League page fetches available seasons via `useLeagueSeasons`
   - Selected season is stored in local state
   - Active season data is passed into the active tab component as `seasonData`
   - Logic in [src/pages/League/League.tsx](src/pages/League/League.tsx)

3. **Open Lineup Tab**
   - User selects the `Lineup` tab from `LeagueTabs`
   - The active tab renders `Lineup`
   - Component in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

4. **Season Setup Guard**
   - If the active season status is `setup`, the lineup does not render assignments yet
   - Instead it shows the `Coming Soon` empty state
   - Empty state is rendered in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

---

### Part 2: Add Drivers to the Season

5. **Open League Management**
   - Director opens `/league/{leagueId}/management`
   - Management page controller in [src/pages/LeagueManagement/LeagueManagment.tsx](src/pages/LeagueManagement/LeagueManagment.tsx)

6. **Select Driver Assignments**
   - Director opens the `Driver Assignments` section for the active season
   - Form in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

7. **Choose Division**
   - Driver assignments fetch season divisions via `useGetLeagueSeasonDivisionsQuery`
   - Selected division defaults to the first available division option in the management form
   - Division filter uses `FilterBar`
   - Logic in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

8. **Load Existing Driver Assignments**
   - Existing season drivers are fetched via `useGetLeagueSeasonDriversBySeasonIdQuery`
   - The form hydrates rows for the selected division only
   - Hydration logic uses `persistedAssignments` and `persistedAssignmentsKey`
   - Logic in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

9. **Add Driver Rows**
   - Director clicks `Add Driver`
   - Form picks the next available participant with the `driver` role
   - Drivers already assigned in the selected division or another division in the same season are excluded
   - `NoDrivers` modal opens if no valid drivers remain
   - Logic in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

10. **Select Driver Profiles**
   - Each row uses `ProfileSelectInput`
   - Options are built from league participants who currently have the `driver` role
   - The current row preserves its existing value even if that profile would otherwise be filtered out
   - Logic in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

11. **Remove Driver Rows**
   - Director can remove any row before save
   - Removing a persisted row means that season driver will be removed on save
   - Row removal UI lives in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

12. **Save Driver Assignments**
   - Save computes:
     - persisted assignments to remove
     - changed assignments to replace
     - new assignments to create
   - Calls `removeLeagueSeasonDriver` for removed rows
   - Calls `createLeagueSeasonDriver` for new or changed rows
   - Refetches season drivers after success
   - Success toast: `Driver assignments updated.`
   - Save logic in [src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx](src/features/leagues/forms/Assignments/DriverAssignments/DriverAssignments.tsx)

---

### Part 3: Render Driver Lineup

13. **Fetch Lineup Data**
   - `Lineup` fetches:
     - season divisions via `useGetLeagueSeasonDivisionsQuery`
     - season drivers via `useGetLeagueSeasonDriversBySeasonIdQuery`
     - league participants via `useGetLeagueParticipantsQuery`
   - Logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

14. **Merge Driver + Profile + Division Data**
   - Lineup builds merged driver objects with:
     - `seasonDriverId`
     - `createdAt`
     - `profileId`
     - division id and name
     - optional team id and team name
     - participant profile info
   - Merging logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

15. **Default to Division 1**
   - If the user has not chosen a division, lineup prefers the division where `division_number === 1`
   - Falls back to the first division option only if needed
   - Logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

16. **Filter Drivers by Selected Division**
   - Only drivers for the active division are shown
   - If multiple divisions exist, user can switch divisions through `FilterBar`
   - UI logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

17. **Sort Drivers by Overall Created Order**
   - Driver-only lineup sorts selected division drivers by `created_at`
   - Driver card number uses the driver's overall position in that sorted division list
   - Card component in [src/components/Cards/DiverLineup/DriverLineup.tsx](src/components/Cards/DiverLineup/DriverLineup.tsx)

18. **Render Desktop Driver Columns**
   - On larger screens, the sorted driver list is split into alternating columns:
     - left column: `1, 3, 5...`
     - right column: `2, 4, 6...`
   - Column layout in [src/pages/League/components/tabs/Lineup/Lineup.styles.ts](src/pages/League/components/tabs/Lineup/Lineup.styles.ts)

19. **Render Mobile Driver List**
   - On mobile, the column wrappers are hidden
   - Drivers render in a single stacked list using `MobileDriverLineup`
   - Mobile layout in [src/pages/League/components/tabs/Lineup/Lineup.styles.ts](src/pages/League/components/tabs/Lineup/Lineup.styles.ts)

20. **Driver Card Content**
   - Each `DriverLineup` card shows:
     - driver number based on overall division `created_at` order
     - username
     - optional team name if assigned
     - avatar
   - Card in [src/components/Cards/DiverLineup/DriverLineup.tsx](src/components/Cards/DiverLineup/DriverLineup.tsx)

---

## Potential Issues/Edge Cases

### Season Status

- **Season Still in Setup**
  - Lineup shows `Coming Soon`
  - No drivers are rendered yet

### Empty States

- **No Drivers Assigned to Division**
  - Driver lineup shows `No Drivers Assigned`
  - Subtitle: `Drivers have not been placed in the lineup yet.`

### Division Rules

- **Multiple Divisions**
  - User can switch divisions with the lineup `FilterBar`

- **No Manual Division Selected Yet**
  - Lineup defaults to division number `1`

### Assignment Rules

- **Driver Already Assigned in Another Division**
  - Driver cannot be added to the current division in Driver Assignments

- **Removing a Persisted Driver Assignment**
  - Save removes that driver from the season lineup for that division

### Numbering Rules

- **Driver-Only Numbering**
  - Driver card numbers are based on overall `created_at` order for the selected division
  - They are not based on team slot order