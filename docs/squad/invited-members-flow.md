# Invited Members Flow

## Steps

### Part 1: Invite Link Entry

1. **User Opens Invite Link**
   - Viewer lands on `/squad/{squadId}?token={inviteToken}`
   - Squad page stores pending invite context for unauthenticated users
   - Page logic in [src/pages/Squad/Squad.tsx](src/pages/Squad/Squad.tsx)

2. **Invite Token Flow Resolves Viewer State**
   - `useSquadInviteTokenFlow` fetches invite row by token and decides which modal to show
   - Hook in [src/hooks/useSquadInviteTokenFlow.tsx](src/hooks/useSquadInviteTokenFlow.tsx)

3. **Token Is Opened Once Per Session**
   - Hook tracks opened/dismissed tokens to prevent duplicate modal re-open loops
   - Cancel marks token dismissed

---

### Part 2: Scenario A — Guest Invited by Email

4. **Viewer Is a Guest (Not Logged In)**
   - `viewType === "guest"`
   - Viewer sees `GuestJoinSquad` alert modal
   - Modal in [src/features/squads/modals/errors/GuestJoinSquad/GuestJoinSquad.tsx](src/features/squads/modals/errors/GuestJoinSquad/GuestJoinSquad.tsx)

5. **What the Viewer Sees**
   - Title: **Account Required to Join Squads**
   - Subtitle prompting login/sign-up to join
   - Buttons:
     - **Cancel**: closes modal and dismisses token for this view
     - **Create Account**: navigates to `/create-account`

6. **After Account Creation/Login**
   - Pending invite token is processed into notification flow on profile-ready session
   - Viewer receives an `INVITE_RECEIVED` notification (if the invite is still valid and they have created a profile)
   - Hook in [src/hooks/usePendingInviteNotification.ts](src/hooks/usePendingInviteNotification.ts)

---

### Part 3: Scenario B — Logged-in User Invited by Email

7. **Viewer Is Logged In With Active Profile(s)**
   - Invite row typically has no `profile_id` for email-targeted invites
   - Hook opens `JoinSquad` modal with `hasProfile=true` and no `profileId`
   - Modal in [src/features/squads/modals/core/JoinSquad/JoinSquad.tsx](src/features/squads/modals/core/JoinSquad/JoinSquad.tsx)

8. **What the Viewer Sees (First Modal)**
   - Title: **Squad Invite**
   - Subtitle: invited to join this squad
   - Buttons:
     - **Cancel**: closes flow
     - **Join Squad**: continues to profile picker

9. **What the Viewer Sees (Profile Picker)**
   - `AcceptJoinSquad` form modal opens
   - Viewer selects which profile to join with
   - Modal in [src/features/squads/forms/Invite/AcceptJoinSquad/AcceptJoinSquad.tsx](src/features/squads/forms/Invite/AcceptJoinSquad/AcceptJoinSquad.tsx)

10. **On Success**
    - User is added to `squad_members` with role `member`
    - Invite token is removed from `squad_invites`
   - Matching `INVITE_RECEIVED` notification is deleted/refetched when applicable
   - `INVITE_ACCEPTED` notification is sent back to inviter when sender metadata is available
    - Success toast shown, modals close, viewer navigates to `/squad/{squadId}`

---

### Part 4: Scenario C — Logged-in User Invited by Profile

11. **Viewer Is Logged In and Invite Is Profile-targeted**
    - Invite row includes `profile_id`
    - Hook opens `JoinSquad` modal with `profileId` pre-resolved

12. **What the Viewer Sees**
    - Title: **Squad Invite**
    - Buttons:
      - **Cancel**: closes flow
      - **Join Squad**: joins immediately (no profile picker)

13. **On Success**
    - Immediate member join with the invite-targeted profile
    - Invite token is removed
   - Matching `INVITE_RECEIVED` notification is deleted/refetched when applicable
   - `INVITE_ACCEPTED` notification is sent back to inviter when sender metadata is available
    - Success toast and redirect to squad page

---

### Part 5: Notification Behavior

14. **Invite Created (Sender Side)**
   - During invite creation, recipients with profile IDs receive `INVITE_RECEIVED` notifications
   - Notification metadata includes `invite_token` for deep-link resolution
   - Flow in [src/features/squads/forms/Invite/InviteSquad/InviteSquad.tsx](src/features/squads/forms/Invite/InviteSquad/InviteSquad.tsx)

15. **Invite Opened (Recipient Side)**
   - Token is resolved via `getInviteTablesByToken`
   - Existing `INVITE_RECEIVED` notification is looked up so it can be cleaned up on acceptance
   - Logic in [src/hooks/useSquadInviteTokenFlow.tsx](src/hooks/useSquadInviteTokenFlow.tsx)

16. **Invite Accepted**
   - Recipient join flow removes invite token row
   - If notification ID is present, the invite notification is deleted and notifications are refetched
   - An `INVITE_ACCEPTED` notification is sent to inviter profile when metadata is available
   - Logic in [src/features/squads/modals/core/JoinSquad/JoinSquad.tsx](src/features/squads/modals/core/JoinSquad/JoinSquad.tsx) and [src/features/squads/forms/Invite/AcceptJoinSquad/AcceptJoinSquad.tsx](src/features/squads/forms/Invite/AcceptJoinSquad/AcceptJoinSquad.tsx)

---

## Potential Issues/Edge Cases

### Viewer State

- **Logged-in User With No Active Profile**
  - Viewer sees `JoinSquad` path that redirects to `SquadNoProfile` when continuing
  - `SquadNoProfile` prompts navigation to `/create-profile`
  - Component in [src/features/squads/modals/core/SquadNoProfile/SquadNoProfile.tsx](src/features/squads/modals/core/SquadNoProfile/SquadNoProfile.tsx)

- **Founder Viewer**
  - Invite join modal is not shown for founders in token flow

### Token + Modal Behavior

- **Duplicate Modal Reopen**
  - Prevented by opened/dismissed token guards in `useSquadInviteTokenFlow`

- **Invalid/Expired Token**
  - If `getInviteTablesByToken` fails, join flow does not open

### Join Failures

- **Member Insert Failure / Token Removal Failure**
  - Errors handled via `handleSupabaseError` (`SERVER_ERROR` fallback)

---

## Key Implementation Details

- Invite dispatch and token validation are centralized in `useSquadInviteTokenFlow`
- `JoinSquad` is the main decision modal
- `AcceptJoinSquad` handles profile selection only when invite is email-based (or profile id unavailable)
- `GuestJoinSquad` and `SquadNoProfile` provide auth/profile prerequisites
- Join success path removes invite token, cleans up invite notifications, and optionally sends `INVITE_ACCEPTED` to inviter

---

## Summary

Invited Members Flow has 3 primary viewer experiences:

1. **Guest invited by email**: sees account-required modal and is routed to account creation
2. **Logged-in user invited by email**: sees invite modal, then selects a profile before joining
3. **Logged-in user invited by profile**: sees invite modal and joins directly with the targeted profile

Each scenario routes through the same token-based entry, but UI adapts to viewer auth/profile state and invite targeting metadata.