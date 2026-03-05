# Delete Squad Flow

## Steps

### Part 1: Open Delete Squad

1. **Open Squad Edit Panel**
   - Founder opens squad edit panel from squad page
   - Panel entry point in [src/features/panels/squadEdit/SquadEdit.tsx](src/features/panels/squadEdit/SquadEdit.tsx)

2. **Launch Delete Squad Modal**
   - User clicks “Delete Squad”
   - Opens `DeleteSquad` form modal
   - Logic in [src/features/panels/squadEdit/forms/DeleteSquad/DeleteSquad.tsx](src/features/panels/squadEdit/forms/DeleteSquad/DeleteSquad.tsx)

---

### Part 2: Confirm Deletion

3. **Confirmation Phrase Required**
   - User must type **“delete squad”**
   - Validation schema in [src/features/panels/squadEdit/forms/DeleteSquad/confirmDeleteSquad.schmea.ts](src/features/panels/squadEdit/forms/DeleteSquad/confirmDeleteSquad.schmea.ts)

4. **Submit Deletion**
   - Dispatches `deleteSquadThunk(currentSquad.id)`
   - Thunk in [src/store/squads/squad.thunk.ts](src/store/squads/squad.thunk.ts)

---

### Part 3: Cleanup & Navigation

5. **Banner Cleanup (If Uploaded)**
   - If squad banner is `upload`, file is removed from Supabase `banners` bucket
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

6. **Relational Cleanup**
   - Deletes related rows in `squad_follows`
   - Deletes related rows in `squad_members`
   - Then deletes row from `squads`
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

7. **UI Updates**
   - Thunk invalidates tags: `Squads`, `SquadMembers`, `SquadFollowers`, `SquadFollowing`
   - User navigates to `/`
   - Modal closes, panel closes, success toast shown
   - Flow end in [src/features/panels/squadEdit/forms/DeleteSquad/DeleteSquad.tsx](src/features/panels/squadEdit/forms/DeleteSquad/DeleteSquad.tsx)

---

## Potential Issues/Edge Cases

### Validation

- **Incorrect Confirmation Phrase**
  - Inline validation error
  - No delete request is sent

### Deletion Errors

- **Squad Fetch Failed**
  - Code: `SQUAD_FETCH_FAILED`

- **Uploaded Banner Delete Failed**
  - Code: `SQUAD_BANNER_DELETION_FAILED`

- **Follows Delete Failed**
  - Code: `SQUAD_FOLLOWS_DELETION_FAILED`

- **Members Delete Failed**
  - Code: `SQUAD_MEMBERS_DELETION_FAILED`

- **Squad Delete Failed**
  - Code: `SQUAD_DELETION_FAILED`

---

## Key Implementation Details

- Deletion is gated behind typed confirmation phrase
- Cleanup is explicit and ordered: storage, follows, members, squad
- Cache invalidation keeps follower/following and squad lists fresh after deletion
- Success path performs navigation and closes active overlays

---

## Summary

Delete Squad is a confirmed modal flow that:

1. Requires typed confirmation
2. Cleans up storage + relational data
3. Deletes the squad record
4. Invalidates caches and returns user to home
