# Manage Participants Flow

## Steps

### Part 1: Open Participant Roles Management

1. **Navigate to League Management**
   - Director navigates to `/league/{leagueId}/management`
   - Page controller in [src/pages/LeagueManagement/LeagueManagment.tsx](src/pages/LeagueManagement/LeagueManagment.tsx)

2. **Select Participant Roles Section**
   - "Participant Roles" is the default active section
   - Active sheet renders the `Roles` form
   - Form in [src/features/leagues/forms/Roles/Roles.tsx](src/features/leagues/forms/Roles/Roles.tsx)

3. **Form Hydration**
   - On load, `Roles` fetches:
     - `leagueApplicationOptions` via `useLeagueApplicationOptions`
     - `joinRequests` via `useLeagueJoinRequests`
     - `participants` via `useLeagueParticipants`
   - Once options load, form resets to hydrated values:
     - `options` (open roles) ← `open_roles` from application options (excluding director)
     - `openApplications` (contact info toggle) ← `contact_info` from application options
   - Logic in [src/features/leagues/forms/Roles/Roles.tsx](src/features/leagues/forms/Roles/Roles.tsx)

---

### Part 2: Control Panel Settings

4. **Configure Open Roles**
   - Director selects which roles are open for applications (e.g., driver, co-driver, engineer)
   - Displayed as checkboxes via `ControlPanel`
   - Component in [src/components/Inputs/ControlPanel/ControlPanel.tsx](src/components/Inputs/ControlPanel/ControlPanel.tsx)

5. **Configure Contact Info Toggle**
   - Toggle (`openApplications`) controls whether applicants must provide contact information
   - Maps to `contact_info` in `league_application_options`
   - Default values for new leagues are documented in [create-league-flow.md](create-league-flow.md)

6. **Save Control Panel Changes**
   - On save, detects if `open_roles`, `contact_info`, or `is_closed` have changed
   - If no application options row exists yet, calls `useAddLeagueApplicationOptions`
   - If row exists, calls `useUpdateLeagueApplicationOptions`
   - `isClosed` is set to `true` automatically if no roles are selected
   - Mutation hooks in [src/hooks/rtkQuery/mutations/useLeagueMutation.ts](src/hooks/rtkQuery/mutations/useLeagueMutation.ts)

---

### Part 3: View & Manage Join Requests

7. **Join Request Table**
   - Pending join requests are displayed in a `SpecialInputTable`
   - Grouped by `profile_id` so multi-role requests appear as one row
   - Component in [src/components/Tables/SpecialInputTable/SpecialInputTable.tsx](src/components/Tables/SpecialInputTable/SpecialInputTable.tsx)

8. **View Request Details**
   - Clicking a join request row opens the `ViewRequest` form modal
   - Shows requester's username, avatar, requested roles, and contact info
   - Director can adjust role assignments before accepting
   - Form in [src/features/leagues/forms/ViewRequest/ViewRequest.tsx](src/features/leagues/forms/ViewRequest/ViewRequest.tsx)

9. **Accept Join Request**
   - Director selects one or more roles for the applicant and submits
   - Calls `useJoinLeagueAsParticipant` — inserts participant row(s) in `league_participants`
   - Calls `useRemoveLeagueJoinRequest` to remove the request row(s)
   - Mutation hooks in [src/hooks/rtkQuery/mutations/useLeagueMutation.ts](src/hooks/rtkQuery/mutations/useLeagueMutation.ts)
   - Success toast: "Request accepted."
   - Modal closes

10. **Reject Join Request**
    - Director clicks "Reject" in the `ViewRequest` modal
    - Opens `RejectRequest` confirmation dialog
    - Dialog in [src/features/leagues/modals/core/RejectRequest/RejectRequest.tsx](src/features/leagues/modals/core/RejectRequest/RejectRequest.tsx)
    - Calls `useRemoveLeagueJoinRequest` with `requestId` and `leagueId`
    - Success toast: "User's request to join rejected."

---

### Part 4: Manage Existing Participants

11. **Participant Table**
    - Current participants are displayed in a `ParticipantTable`
    - Each row shows avatar, username, and current role(s)
    - Component in [src/components/Tables/InputTable/InputTable.tsx](src/components/Tables/InputTable/InputTable.tsx)

12. **Add Participant Role**
    - Director can assign an additional role to an existing participant
    - Calls `useAddLeagueParticipantRole`
    - Mutation in [src/hooks/rtkQuery/mutations/useLeagueMutation.ts](src/hooks/rtkQuery/mutations/useLeagueMutation.ts)

13. **Remove Participant Role**
    - Director can remove a role from an existing participant
    - Calls `useRemoveLeagueParticipantRole`
    - Mutation in [src/hooks/rtkQuery/mutations/useLeagueMutation.ts](src/hooks/rtkQuery/mutations/useLeagueMutation.ts)

14. **Remove Participant**
    - Director clicks the remove (kick) action on a participant row
    - Opens `RemoveParticipant` confirmation dialog
    - Dialog in [src/features/leagues/modals/core/RemoveParticipant/RemoveParticipant.tsx](src/features/leagues/modals/core/RemoveParticipant/RemoveParticipant.tsx)
    - Calls `useRemoveLeagueParticipant` with `leagueId` and `profileId`
    - Success toast: "Participant removed from League."

---

### Part 5: Save Participant Role Changes

15. **Submit All Role Changes**
    - Director clicks Save
    - Save button shows loading state (`isSaving` / `saveLoadingText`) via `formState.isSubmitting`
    - Processes all pending `addLeagueParticipantRole` and `removeLeagueParticipantRole` mutations
    - Logic in [src/features/leagues/forms/Roles/Roles.tsx](src/features/leagues/forms/Roles/Roles.tsx)

16. **Validation Checks Before Save**
    - If any participant has no role assigned → `UnassignedParticipant` error modal
    - If no director role exists in the participant list → `NoDirector` error modal
    - Modals in [src/features/leagues/modals/errors/UnassignedParticipant/UnassignedParticipant.tsx](src/features/leagues/modals/errors/UnassignedParticipant/UnassignedParticipant.tsx) and [src/features/leagues/modals/errors/NoDirector/NoDirector.tsx](src/features/leagues/modals/errors/NoDirector/NoDirector.tsx)

17. **Context-Aware Success Toasts**
    - Control panel settings only changed → "Control panel settings updated."
    - Participant roles and control panel changed → "Participant roles and control panel settings updated."
    - Participant roles only changed → "Participant roles updated."

---

## Potential Issues/Edge Cases

### Access Rules

- **Non-Director**
  - Management page is a protected route; only directors can access participant management

### Validation

- **No Roles Selected for Any Participant**
  - `UnassignedParticipant` modal blocks save

- **No Director Role Assigned**
  - `NoDirector` modal blocks save

### Accept Request Errors

- **No Roles Selected When Accepting**
  - Toast error: "Select at least one role to accept this request."
  - Form not submitted

### Contact Info Form on Join Panel

- See [join-league-flow.md](join-league-flow.md) for how `contact_info` flag affects the applicant-side join form
