# Join League Flow

## Steps

### Part 1: Join Action Entry

1. **Navigate to League**
   - User views `/league/{leagueId}`
   - Page controller in [src/pages/League/League.tsx](src/pages/League/League.tsx)

2. **Resolve Viewer Context**
   - `viewType` derived from `useLeaguePageReadyState`
   - `hasProfile` from `selectHasProfiles`
   - Wiring in [src/pages/League/League.tsx](src/pages/League/League.tsx)

3. **Trigger Join Action**
   - Non-participant viewers see a "Join" action button in the Cover area
   - Component in [src/components/Structures/Cover/Cover.tsx](src/components/Structures/Cover/Cover.tsx)

---

### Part 2: Pre-Join Modal Routing

4. **Guest User**
   - Opens `LeagueGuestFollow` modal with `type="join"`
   - Continue path navigates to `/create-account`
   - Modal in [src/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow.tsx](src/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow.tsx)

5. **Logged-in User with No Profile**
   - Opens `LeagueNoProfile` modal with `type="join"`
   - Continue path navigates to `/create-profile`
   - Modal in [src/features/leagues/modals/core/LeagueNoProfile/LeagueNoProfile.tsx](src/features/leagues/modals/core/LeagueNoProfile/LeagueNoProfile.tsx)

6. **Eligible to Join**
   - Opens `LEAGUE_JOIN` panel with `leagueId`
   - Panel in [src/features/panels/leagueJoin/LeagueJoin.tsx](src/features/panels/leagueJoin/LeagueJoin.tsx)

---

### Part 3: League Join Panel

7. **Fetch Application Options**
   - Panel fetches `leagueApplicationOptions` via `useLeagueApplicationOptions(leagueId)`
   - Determines which roles are open and whether applications are currently accepted
   - Query hook in [src/hooks/rtkQuery/queries/useLeagues.ts](src/hooks/rtkQuery/queries/useLeagues.ts)

8. **Loading Guard**
   - Panel returns `null` while `isApplicationOptionsLoading` is true
   - Logic in [src/features/panels/leagueJoin/LeagueJoin.tsx](src/features/panels/leagueJoin/LeagueJoin.tsx)

9. **Applications Closed State**
   - If `is_closed` is true or no open roles are configured (excluding director), `availableJoinRoles` is empty
   - Panel renders `EmptyMessage` with title "Applications Closed"
   - Component in [src/components/Messages/EmptyMessage/EmptyMessage.tsx](src/components/Messages/EmptyMessage/EmptyMessage.tsx)

---

### Part 4: Join Form

10. **Select Profile & Roles**
    - User selects which of their profiles to join with
    - Role checkboxes are generated from `availableJoinRoles` (open roles, excluding director)
    - Driver role is checked by default if available; otherwise the first available role is checked
    - Form component in [src/components/Forms/JoinForm/JoinForm.tsx](src/components/Forms/JoinForm/JoinForm.tsx)

11. **Contact Info Field (Conditional)**
    - If `leagueApplicationOptions.contact_info` is `true`, a Contact Information text field is shown
    - If `contact_info` is `false`, the field is hidden and its value is cleared
    - Logic in [src/features/panels/leagueJoin/LeagueJoin.tsx](src/features/panels/leagueJoin/LeagueJoin.tsx)

12. **Validate Form**
    - Schema validates `leagueId`, `profile_joining`, and `options`
    - `contactInfo` minimum length is enforced at submit time (not in schema) when `showContactInfo` is true
    - Schema in [src/features/panels/leagueJoin/leagueJoinSchema.ts](src/features/panels/leagueJoin/leagueJoinSchema.ts)

13. **Multiple Errors**
    - Invalid submit handler (`handleInvalidSubmit`) runs alongside schema validation
    - Allows contact info error and role/profile errors to surface simultaneously
    - Logic in [src/features/panels/leagueJoin/LeagueJoin.tsx](src/features/panels/leagueJoin/LeagueJoin.tsx)

---

### Part 5: Submit Join Request

14. **Submit Request Mutation**
    - Calls `useCreateLeagueJoinRequest` with:
      - `leagueId`
      - `profileId` (selected profile)
      - `accountId`
      - `roles` (selected role values)
      - `contactInfo` (empty string if field hidden)
    - Mutation in [src/hooks/rtkQuery/mutations/useLeagueMutation.ts](src/hooks/rtkQuery/mutations/useLeagueMutation.ts)

15. **Service Insert**
    - Creates one row in `league_join_requests` per selected role
    - Service in [src/services/league.service.ts](src/services/league.service.ts)

16. **Success**
    - Opens `RequestSent` success modal
    - Panel closes
    - Modal in [src/features/panels/leagueJoin/modals/success/RequestSent/RequestSent.tsx](src/features/panels/leagueJoin/modals/success/RequestSent/RequestSent.tsx)

---

## Potential Issues/Edge Cases

### Access Rules

- **Guest Join Attempt**
  - `LeagueGuestFollow` modal with `type="join"` shown
  - Redirect to account creation

- **No Profile Join Attempt**
  - `LeagueNoProfile` modal with `type="join"` shown
  - Redirect to profile creation

### Applications State

- **League Closed for Applications**
  - Panel shows "Applications Closed" empty state instead of form

- **No Open Roles Configured**
  - Treated same as closed; empty state shown

### Validation

- **No Role Selected**
  - Schema error prevents submission

- **Contact Info Too Short (when required)**
  - Runtime error set via `setError` in `handleInvalidSubmit`
