# Follow Squad Flow

## Steps

### Part 1: Follow Action Entry

1. **Navigate to Squad**
   - User views `/squad/{squadId}`
   - Page controller in [src/pages/Squad/Squad.tsx](src/pages/Squad/Squad.tsx)

2. **Resolve Viewer Context**
   - `viewType` derived from `selectSquadViewType()`
   - `hasProfile` from `selectHasProfiles`
   - Follow status from `useIsFollowingSquad`
   - Wiring in [src/pages/Squad/Squad.tsx](src/pages/Squad/Squad.tsx)

3. **Render Follow/Following Button**
   - In `SquadHeader`, guest/user viewers see follow-related button
   - Component in [src/components/Headers/SquadHeader/SquadHeader.tsx](src/components/Headers/SquadHeader/SquadHeader.tsx)

---

### Part 2: Modal Routing by Context

4. **Guest User**
   - Opens `SquadGuestFollow` modal
   - Continue path navigates to `/create-account`
   - Modal in [src/features/squads/modals/errors/SquadGuestFollow/SquadGuestFollow.tsx](src/features/squads/modals/errors/SquadGuestFollow/SquadGuestFollow.tsx)

5. **Logged-in User with No Profile**
   - Opens `SquadNoProfile` modal
   - Continue path navigates to `/create-profile`
   - Modal in [src/features/squads/modals/core/SquadNoProfile/SquadNoProfile.tsx](src/features/squads/modals/core/SquadNoProfile/SquadNoProfile.tsx)

6. **Already Following**
   - Opens `UnfollowSquad` confirmation modal
   - Unfollow flow uses mutation hook `useUnfollowSquad`
   - Modal in [src/features/squads/modals/errors/UnfollowSqaud/UnfollowSquad.tsx](src/features/squads/modals/errors/UnfollowSqaud/UnfollowSquad.tsx)

7. **Eligible to Follow**
   - Opens `FollowSquad` modal
   - Form in [src/features/squads/forms/Follow/FollowSquad.tsx](src/features/squads/forms/Follow/FollowSquad.tsx)

---

### Part 3: Follow Submission

8. **Select Profile to Follow With**
   - Dropdown lists user profiles (`state.profile.data`)
   - Converted with `convertProfilesToSelectOptions`
   - Validation requires selected profile
   - Schema in [src/features/squads/forms/Follow/followSquadSchema.ts](src/features/squads/forms/Follow/followSquadSchema.ts)

9. **Submit Follow Mutation**
   - Calls `useFollowSquadMutation`
   - Mutation endpoint in [src/store/rtkQueryAPI/squadApi.ts](src/store/rtkQueryAPI/squadApi.ts)

10. **Service Insert**
    - Inserts row into `squad_follows` with:
      - `follower_id`
      - `follower_account_id`
      - `squad_id`
    - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

11. **Success + Cache Refresh**
    - Success toast: “Now following this Squad.”
    - Modal closes
    - RTK Query invalidates `SquadFollowers` and `SquadFollowing` tags

---

## Potential Issues/Edge Cases

### Access Rules

- **Guest Follow Attempt**
  - Redirect path to account creation

- **No Profile Follow Attempt**
  - Redirect path to profile creation

### Form Validation

- **No Profile Selected**
  - Inline validation error
  - Submit blocked

### Follow Errors

- **Insert/Server Failure**
  - Generic error modal via `handleSupabaseError`
  - Fallback code path uses `SERVER_ERROR`

---

## Key Implementation Details

- Follow behavior is centralized in `SquadHeader` action handler
- Form uses `react-hook-form` + Zod
- Mutation/service split: `squadApi` endpoint + `followSquadService`
- Cache invalidation updates both followers count and following lists

---

## Summary

Follow Squad is a context-aware modal flow that:

1. Checks auth/profile/following state
2. Routes to the correct modal (guest, no-profile, unfollow, follow)
3. Inserts follow record when valid
4. Refreshes cached squad follower/following data
