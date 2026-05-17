# Team Lineup Flow

## Steps

### Part 1: Open League Lineup

1. **Navigate to League Page**
   - User opens `/league/{leagueId}`
   - Page controller in [src/pages/League/League.tsx](src/pages/League/League.tsx)

2. **Resolve Active Season**
   - League page fetches seasons and tracks the active season in local state
   - The active season object is passed to the lineup tab as `seasonData`
   - Logic in [src/pages/League/League.tsx](src/pages/League/League.tsx)

3. **Open Lineup Tab**
   - User selects the `Lineup` tab from `LeagueTabs`
   - Active lineup UI renders from [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

4. **Team Championship Requirement**
   - Team lineup is only available when the active season has `is_team_championship = true`
   - In this case the lineup shows segmented tabs for `Teams` and `Drivers`
   - Tab logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

5. **Season Setup Guard**
   - If the active season status is `setup`, lineup shows the `Coming Soon` empty state instead of team cards
   - Logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

---

### Part 2: Add Teams to the Season

6. **Open League Management**
   - Director opens `/league/{leagueId}/management`
   - Page controller in [src/pages/LeagueManagement/LeagueManagment.tsx](src/pages/LeagueManagement/LeagueManagment.tsx)

7. **Open Team Assignments**
   - Director selects `Team Assignments` for the active season
   - Form in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

8. **Choose Division**
   - Team assignments fetch season divisions via `useGetLeagueSeasonDivisionsQuery`
   - Active division defaults to division number `1` when available
   - Division filter uses `FilterBar`
   - Logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

9. **Open Teams Tab in the Form**
   - Team championship seasons expose segmented tabs in the management form:
     - `Teams`
     - `Drivers`
   - `Teams` tab manages the team rows themselves
   - Tabs in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

10. **Create Team Rows**
   - Director clicks `Add Team`
   - New rows use local ids until save
   - Team name is entered in `TextInput`
   - Row creation in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

11. **Validate Team Names**
   - Team names are validated by `teamAssignmentsFormSchema`
   - Name is required and capped by `TEAM_NAME_MAX_LENGTH`
   - Schema in [src/features/leagues/forms/Assignments/TeamAssignments/teamAssignments.schema.ts](src/features/leagues/forms/Assignments/TeamAssignments/teamAssignments.schema.ts)

12. **Block Team Deletion While Drivers Are Assigned**
   - A team cannot be removed while any current assignment row still points to it
   - `DriversAssigned` modal opens if director tries to remove it early
   - Logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

13. **Save Team Rows**
   - Save creates new teams via `createLeagueSeasonTeam`
   - Renamed teams update via `updateLeagueSeasonTeam`
   - Deleted teams remove via `removeLeagueSeasonTeam`
   - Save logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

---

### Part 3: Add Drivers to Teams

14. **Open Drivers Tab in Team Assignments**
   - Director switches the Team Assignments form to the `Drivers` tab
   - This tab manages driver-to-team links for the active division
   - Logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

15. **Load Existing Division Drivers**
   - Form fetches all season drivers for the season and narrows them to the active division
   - Existing saved driver-team links are hydrated into assignment rows
   - Hydration logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

16. **Add Driver-Team Rows**
   - Director clicks `Add Driver`
   - If there are no valid teams yet, `NoTeams` modal opens
   - If there are no valid drivers left, `NoDrivers` modal opens
   - Added row defaults to the next available driver and the first available team option
   - Logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

17. **Select Driver and Team**
   - Driver uses `ProfileSelectInput`
   - Team uses `SelectInput`
   - Driver options exclude drivers already used in another row or another division, while preserving the current row's existing value
   - Logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

18. **Save Team Assignments**
   - Save resolves local team ids to real saved team ids
   - Existing season drivers whose team changed update through `updateLeagueSeasonDriverTeam`
   - New team-assigned drivers create through `createLeagueSeasonDriver`
   - If a previously team-assigned driver is removed from this form, save removes that season driver from the division lineup via `removeLeagueSeasonDriver`
   - Refetches season drivers and division teams after success
   - Success toast: `Team assignments updated.`
   - Save logic in [src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx](src/features/leagues/forms/Assignments/TeamAssignments/TeamAssignments.tsx)

---

### Part 4: Render Team Lineup

19. **Fetch Team Lineup Data**
   - `Lineup` fetches:
     - season divisions
     - season drivers
     - season teams
     - league participants
   - Data is merged in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

20. **Default to Division 1**
   - If user has not chosen a division yet, lineup prefers division number `1`
   - If multiple divisions exist, `FilterBar` lets the viewer switch divisions
   - Division logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

21. **Show Team/Driver Segmented Tabs**
   - Team championship seasons show:
     - `Teams` tab for grouped team cards
     - `Drivers` tab for individual driver cards
   - Tab control in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

22. **Build Team Driver Order**
   - Each team's drivers are filtered from season drivers by `team_id`
   - They are sorted by `created_at`
   - Each driver receives a `teamDriverNumber` based on that team-local order
   - Merge logic in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

23. **Render Team Cards**
   - `Teams` tab renders one `TeamLineup` card per team in the selected division
   - Each card shows:
     - team number based on render order in the selected division
     - team name
     - assigned drivers
     - each driver's team-local number
     - username, avatar, and tags
   - Card component in [src/components/Cards/TeamLineup/TeamLineup.tsx](src/components/Cards/TeamLineup/TeamLineup.tsx)

24. **Render Empty Team State**
   - If no teams exist in the selected division, lineup shows `No Teams Assigned`
   - Subtitle: `Teams have not been created yet.`
   - Empty state in [src/pages/League/components/tabs/Lineup/Lineup.tsx](src/pages/League/components/tabs/Lineup/Lineup.tsx)

---

## Potential Issues/Edge Cases

### Season Status

- **Season Still in Setup**
  - Team lineup does not render yet
  - Page shows `Coming Soon`

### Team Championship Rules

- **Season Is Not a Team Championship**
  - Team lineup tab does not apply
  - Lineup falls back to driver-only display

### Empty States

- **No Teams Created Yet**
  - Team lineup shows `No Teams Assigned`

- **Team Exists but Has No Drivers**
  - `TeamLineup` shows `No Drivers Assigned`

### Assignment Rules

- **No Teams Available When Adding Driver-Team Row**
  - `NoTeams` modal blocks adding a driver row

- **No Drivers Available When Adding Driver-Team Row**
  - `NoDrivers` modal blocks adding a driver row

- **Driver Already Assigned in Another Division**
  - Driver cannot be added again in the selected division

- **Removing a Driver-Team Row for a Saved Driver**
  - Save removes that season driver from the lineup for the current division

### Numbering Rules

- **Team Driver Numbering**
  - Team cards use team-local order based on `created_at`
  - This numbering stays separate from the driver-only overall order