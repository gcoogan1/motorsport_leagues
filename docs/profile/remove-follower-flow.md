#+#+#+#+
# Remove Follower Flow

## Steps

### Part 1: Open Followers Panel

1. **Open Followers Panel**
	- User opens the Followers panel for a profile
	- Panel entry point in [src/features/panels/profileFollowers/profileFollowers.tsx](src/features/panels/profileFollowers/profileFollowers.tsx)

2. **Open Actions Menu**
	- User clicks the menu icon next to a follower
	- Menu options are rendered by `ProfileList`
	- List in [src/components/Lists/ProfileList/ProfileList.tsx](src/components/Lists/ProfileList/ProfileList.tsx)

---

### Part 2: Confirm Removal

3. **Select “Remove User”**
	- Only available when the current user is allowed to remove followers
	- Action handled in [src/features/panels/profileFollowers/profileFollowers.tsx](src/features/panels/profileFollowers/profileFollowers.tsx)

4. **Open Remove Follower Modal**
	- Modal is opened with `RemoveFollower`
	- UI and logic in [src/features/panels/profileFollowers/modals/core/RemoveFollower/RemoveFollower.tsx](src/features/panels/profileFollowers/modals/core/RemoveFollower/RemoveFollower.tsx)

---

### Part 3: Remove & Sync

5. **Submit Removal**
	- Calls `useRemoveFollowerMutation`
	- Mutation in [src/store/rtkQueryAPI/profileApi.ts](src/store/rtkQueryAPI/profileApi.ts)

6. **Database Delete**
	- Deletes row from `profile_follows`
	- Service in [src/services/profile.service.ts](src/services/profile.service.ts)

7. **UI Updates**
	- Success toast: “Follower removed.”
	- Modal closes
	- Followers list refetches due to tag invalidation
	- Toast logic in [src/features/panels/profileFollowers/modals/core/RemoveFollower/RemoveFollower.tsx](src/features/panels/profileFollowers/modals/core/RemoveFollower/RemoveFollower.tsx)

---

## Potential Issues/Edge Cases

### Authorization

- **Not logged in**
  - Remove action is blocked before opening the modal

### Network/Server Errors

- **Remove request fails**
  - Generic error modal via `handleSupabaseError`
  - Error handling in [src/features/panels/profileFollowers/modals/core/RemoveFollower/RemoveFollower.tsx](src/features/panels/profileFollowers/modals/core/RemoveFollower/RemoveFollower.tsx)

---

## Key Implementation Details

- Removal is confirmed via a modal dialog
- Mutation uses RTK Query and invalidates follower-related tags
- Supabase delete filters by `follower_id` and `following_id`
- Toast feedback is shown on success

---

## Summary

Remove Follower is a modal-confirmed flow that:

1. Opens the followers list
2. Launches a confirmation modal
3. Deletes the follow record
4. Invalidates cached follower data and updates the UI
