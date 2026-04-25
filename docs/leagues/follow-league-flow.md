# Follow League Flow

## Steps

### Part 1: Follow Action Entry

1. **Navigate to League**
   - User views `/league/{leagueId}`
   - Page controller in [src/pages/League/League.tsx](src/pages/League/League.tsx)

2. **Resolve Viewer Context**
   - `viewType` derived from `useLeaguePageReadyState`
   - `hasProfile` from `selectHasProfiles`
   - Follow status from `useIsFollowingLeague`
   - Wiring in [src/pages/League/League.tsx](src/pages/League/League.tsx)

3. **Render Follow/Following Button**
   - Guest and non-participant viewers see a follow-related action button in the Cover actions area
   - Component in [src/components/Structures/Cover/Cover.tsx](src/components/Structures/Cover/Cover.tsx)

---

### Part 2: Modal Routing by Context

4. **Guest User**
   - Opens `LeagueGuestFollow` modal (default, no `type` prop)
   - Continue path navigates to `/create-account`
   - Modal in [src/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow.tsx](src/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow.tsx)

5. **Logged-in User with No Profile**
   - Opens `LeagueNoProfile` modal (default, no `type` prop)
   - Continue path navigates to `/create-profile`
   - Modal in [src/features/leagues/modals/core/LeagueNoProfile/LeagueNoProfile.tsx](src/features/leagues/modals/core/LeagueNoProfile/LeagueNoProfile.tsx)

6. **Already Following**
   - Opens `UnfollowLeague` confirmation modal
   - Unfollow flow uses mutation hook `useUnfollowLeague`
   - Modal in [src/features/leagues/modals/errors/UnfollowLeague/UnfollowLeague.tsx](src/features/leagues/modals/errors/UnfollowLeague/UnfollowLeague.tsx)

7. **Eligible to Follow**
   - Opens `FollowLeague` form modal
   - Form in [src/features/leagues/forms/Follow/FollowLeague.tsx](src/features/leagues/forms/Follow/FollowLeague.tsx)

---

### Part 3: Follow Submission

8. **Select Profile to Follow With**
   - Dropdown lists user profiles (`state.profile.data`)
   - Converted with `convertProfilesToSelectOptions`
   - Validation requires a selected profile
   - Schema in [src/features/leagues/forms/Follow/followLeagueSchema.ts](src/features/leagues/forms/Follow/followLeagueSchema.ts)

9. **Submit Follow Mutation**
   - Calls `useFollowLeagueMutation`
   - Mutation endpoint in [src/store/rtkQueryAPI/leagueApi.ts](src/store/rtkQueryAPI/leagueApi.ts)

10. **Service Insert**
    - Inserts row into `league_follows` with:
      - `follower_id` (profile ID)
      - `follower_account_id`
      - `league_id`
    - Service in [src/services/league.service.ts](src/services/league.service.ts)

11. **Success + Cache Refresh**
    - Success toast: "Now following this League."
    - Modal closes
    - RTK Query invalidates `LeagueFollowers` and related tags

---

### Part 4: Unfollow Submission

12. **Confirm Unfollow**
    - `UnfollowLeague` dialog shows confirmation prompt
    - Modal in [src/features/leagues/modals/errors/UnfollowLeague/UnfollowLeague.tsx](src/features/leagues/modals/errors/UnfollowLeague/UnfollowLeague.tsx)

13. **Submit Unfollow Mutation**
    - Calls `useUnfollowLeague` with `leagueId` and `accountId`
    - Mutation endpoint in [src/store/rtkQueryAPI/leagueApi.ts](src/store/rtkQueryAPI/leagueApi.ts)

14. **Service Delete**
    - Removes row from `league_follows`
    - Service in [src/services/league.service.ts](src/services/league.service.ts)

15. **Success**
    - Success toast: "No longer following this League."
    - Modal closes

---

## Potential Issues/Edge Cases

### Access Rules

- **Guest Follow Attempt**
  - Redirect path to account creation

- **No Profile Follow Attempt**
  - Redirect path to profile creation
