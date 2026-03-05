# Remove Squad Follower Flow

## Steps

### Part 1: Open Followers Panel

1. **Open Followers Panel**
   - User opens followers from Squad page header
   - Trigger in [src/pages/Squad/Squad.tsx](src/pages/Squad/Squad.tsx)
   - Panel component in [src/features/panels/squadFollowers/SquadFollowers.tsx](src/features/panels/squadFollowers/SquadFollowers.tsx)

2. **Show Follower Actions**
   - Followers list rendered via `ProfileList`
   - Remove action enabled only when `squadViewType === "founder"`
   - Logic in [src/features/panels/squadFollowers/SquadFollowers.tsx](src/features/panels/squadFollowers/SquadFollowers.tsx)

---

### Part 2: Confirm Removal

3. **Select Remove Action**
   - Founder chooses remove for a follower
   - Opens `RemoveSquadFollower` modal
   - Modal in [src/features/panels/squadFollowers/modals/core/RemoveSquadFollower/RemoveSquadFollower.tsx](src/features/panels/squadFollowers/modals/core/RemoveSquadFollower/RemoveSquadFollower.tsx)

4. **Confirm in Dialog**
   - User confirms “Remove Follower” action
   - Dialog action triggers mutation submit

---

### Part 3: Delete Follow Record & Refresh

5. **Submit Mutation**
   - Calls `useRemoveSquadFollowerMutation`
   - Endpoint in [src/store/rtkQueryAPI/squadApi.ts](src/store/rtkQueryAPI/squadApi.ts)

6. **Service Delete**
   - Deletes row from `squad_follows` by:
     - `squad_id`
     - `follower_id`
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

7. **UI Updates**
   - Success toast: “Follower removed.”
   - Modal closes
   - `SquadFollowers` + `SquadFollowing` cache tags invalidated for refetch

---

## Potential Issues/Edge Cases

### Authorization/Visibility

- **Non-founder View**
  - Remove action is not exposed in followers list UI

### Network/Server Errors

- **Delete Request Fails**
  - Generic error modal via `handleSupabaseError`
  - Fallback code path uses `SERVER_ERROR`

---

## Key Implementation Details

- Removal starts from followers panel, not directly from squad header
- Action is role-gated in UI by squad view type
- RTK Query mutation drives backend delete and cache refresh
- Success feedback uses toast + modal close

---

## Summary

Remove Squad Follower is a founder-only confirmation flow that:

1. Opens from Squad Followers panel
2. Confirms follower removal
3. Deletes follow relation
4. Refreshes follower/following data and updates UI
