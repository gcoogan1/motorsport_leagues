# Leave League Flow

## Steps

### Part 1: Trigger Leave Action

1. **Navigate to League**
   - Participant views `/league/{leagueId}`
   - Page controller in [src/pages/League/League.tsx](src/pages/League/League.tsx)

2. **Resolve Participant Context**
   - `viewType` is `"participant"` for league members
   - `currentParticipant` resolved by matching `account_id` against the participants list from `useLeagueParticipants`
   - Wiring in [src/pages/League/League.tsx](src/pages/League/League.tsx)

3. **Open More Dropdown**
   - Non-director participants see a "More" button in the Cover actions area
   - Clicking "More" opens a dropdown with a "Leave League" option
   - Actions built in [src/pages/League/League.actions.tsx](src/pages/League/League.actions.tsx)
   - Drop down rendered via Cover component in [src/components/Structures/Cover/Cover.tsx](src/components/Structures/Cover/Cover.tsx)

4. **Trigger Leave Handler**
   - Selecting "Leave League" from the dropdown calls `handleLeaveLeague`
   - Guard: if `currentParticipant` is not found, action is no-op
   - Logic in [src/pages/League/League.tsx](src/pages/League/League.tsx)

---

### Part 2: Confirm Leave

5. **Open LeaveLeague Modal**
   - Opens `LeaveLeague` dialog with `leagueId` and `profileId` from `currentParticipant`
   - Modal in [src/features/leagues/modals/core/LeaveLeague/LeaveLeague.tsx](src/features/leagues/modals/core/LeaveLeague/LeaveLeague.tsx)

6. **Confirm or Cancel**
   - Dialog presents "Leave League" (danger) and "Cancel" buttons
   - Cancelling closes the modal without any changes

---

### Part 3: Submit Leave Request

7. **Submit Leave Mutation**
   - Calls `useRemoveLeagueParticipant` with `leagueId` and `profileId`
   - Mutation in [src/hooks/rtkQuery/mutations/useLeagueMutation.ts](src/hooks/rtkQuery/mutations/useLeagueMutation.ts)

8. **Service Delete**
   - Removes participant row(s) from `league_participants`
   - Service in [src/services/league.service.ts](src/services/league.service.ts)

9. **Success**
   - Success toast: "You've left the League."
   - Modal closes

---

## Potential Issues/Edge Cases

### Access Rules

- **Director Cannot Leave via This Flow**
  - The "More" dropdown (and Leave option) is only rendered when `isDirector` is `false`
  - Director must transfer or delete the league through management

### Participant Resolution

- **Participant Not Found**
  - `handleLeaveLeague` is a no-op if `currentParticipant` is undefined
  - Prevents opening the modal with missing IDs
