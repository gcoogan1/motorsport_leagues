# Invite Members Flow

## Steps

### Part 1: Open Invite Flow

1. **Open Squad Page**
   - Founder navigates to `/squad/{squadId}`
   - Page controller in [src/pages/Squad/Squad.tsx](src/pages/Squad/Squad.tsx)

2. **Resolve Founder Invite Context**
   - Invite identity is derived from founder membership context (`useSquadFounderContext`)
   - Invite action is gated by `isViewerFounder`
   - Wiring in [src/pages/Squad/Squad.tsx](src/pages/Squad/Squad.tsx)

3. **Launch Invite Modal**
   - Header invite action triggers `onInvite`
   - Opens `InviteSquad` modal with:
     - `squadId`
     - `squadName`
     - `founderName`
     - `founderProfileId`
     - `founderAccountId`
   - Header component in [src/components/Headers/SquadHeader/SquadHeader.tsx](src/components/Headers/SquadHeader/SquadHeader.tsx)
   - Modal in [src/features/squads/forms/Invite/InviteSquad/InviteSquad.tsx](src/features/squads/forms/Invite/InviteSquad/InviteSquad.tsx)

---

### Part 2: Build Invite Targets

4. **Load Selectable Profiles**
   - Fetches account profiles via `useGetProfilesQuery`
   - Fetches current squad members via `useSquadMembers`
   - Current members are excluded from selectable invite targets

5. **Enter Invitees (Profiles or Emails)**
   - Input uses `MultiUserInput` with mixed profile/email entries
   - Component in [src/components/Inputs/MultiUserInput/MultiUserInput.tsx](src/components/Inputs/MultiUserInput/MultiUserInput.tsx)

6. **Validate Invite Payload**
   - Schema: `inviteSchema`
   - Rules:
     - at least 1 invitee
     - maximum 6 invitees
     - no duplicate values (case-insensitive)
     - no duplicate profile IDs
   - Schema in [src/features/squads/forms/Invite/InviteSquad/inviteSquadSchema.ts](src/features/squads/forms/Invite/InviteSquad/inviteSquadSchema.ts)

---

### Part 3: Send Invites + Notify

7. **Normalize Invitees to EmailInvite[]**
   - Profile invitees resolve account email via `getAccountEmailById`
   - Direct email invitees pass through as typed
   - Transformation in [src/features/squads/forms/Invite/InviteSquad/InviteSquad.tsx](src/features/squads/forms/Invite/InviteSquad/InviteSquad.tsx)

8. **Call Invite Service**
   - `inviteToSquad` invokes Supabase Edge Function `invite_user`
   - Payload includes sender identity + squad metadata
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

9. **Create Invite Notifications**
   - For invitees with `profileId`, creates `INVITE_RECEIVED` notifications
   - Metadata includes `squad_name`, `sender_username`, and invite token
   - Mutation in [src/hooks/rtkQuery/mutations/useNotificationMutation.ts](src/hooks/rtkQuery/mutations/useNotificationMutation.ts)

10. **Refresh Pending Invites + Close**
    - Refetches `useSquadInvites(squadId)` to sync pending invite list
    - Shows success toast: `Invite(s) sent.`
    - Closes modal

---

## Potential Issues/Edge Cases

### Access & Eligibility

- **Non-founder Viewer**
  - Invite action is not executed when viewer is not founder

- **Already a Squad Member**
  - Profile is filtered out of selectable invite targets

### Validation

- **Empty Invite List**
  - Inline validation: at least one profile/email required

- **Over Limit**
  - Inline validation: max 6 invitees

- **Duplicate Invitees**
  - Inline validation blocks duplicate values/profile IDs

### Network/Server

- **Invite Function Failure**
  - Error handled with `handleSupabaseError` (fallback `SERVER_ERROR`)

- **Email Lookup Failure for Profile Invitees**
  - Missing email can produce incomplete invite payload for that entry

- **Notification Create Failure**
  - Invite may still succeed even if follow-up notification creation fails for one invitee

---

## Key Implementation Details

- Modal form is `react-hook-form` + Zod (`inviteSchema`)
- Invite transport uses Supabase Edge Function (`invite_user`)
- Sender identity passed explicitly (`founderAccountId`, `founderProfileId`, `founderName`)
- Pending invites are refreshed after send via `refetchPendingInvites()`
- Success feedback uses toast + modal close

---

## Summary

Invite Members is a founder-only modal flow that:

1. Opens from squad header invite action
2. Collects profile/email targets with validation
3. Sends invites through the edge function
4. Creates recipient notifications where applicable
5. Refreshes pending invites and closes on success
