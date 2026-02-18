# Follow Profile Flow

## Steps

### Part 1: Follow Button Click

1. **Navigate to Profile**
   - User goes to `/profile/{profileId}`
   - Flow controller lives in [src/pages/Profile/Profile.tsx](src/pages/Profile/Profile.tsx)

2. **Check Follow Status**
   - System checks if user is authenticated via `user?.id`
   - Checks if user has active profiles via `userHasActiveProfile`
   - Checks if already following via `isFollowing`
   - Logic in [src/pages/Profile/Profile.tsx](src/pages/Profile/Profile.tsx)

3. **Show Appropriate Button**
   - **Own Profile:** Shows "Edit Profile" button
   - **Other Profile (Authenticated, Has Profiles):** Shows "Follow" button
   - **Other Profile (Authenticated, No Profiles):** Shows "Follow" button (triggers NoProfile modal)
   - **Other Profile (Not Authenticated):** Shows "Follow" button (triggers login redirect)
   - **Already Following:** Shows "Unfollow" button

---

### Part 2: Follow Modal Opens

4. **FollowProfile Modal Appears**
   - Triggered when user clicks "Follow" button with valid context
   - Component in [src/features/profiles/forms/Follow/FollowProfile.tsx](src/features/profiles/forms/Follow/FollowProfile.tsx)
   - Props passed:
     - `userId` - Current user's account ID
     - `profileIdToFollow` - Profile ID being followed (from URL)

5. **Load User Profiles**
   - Fetches user's profiles from Redux state via `state.profile.data`
   - Profiles are converted to form-compatible shape via `convertProfilesToSelectOptions` utility
   - Utility in [src/utils/convertProfilesToSelectOptions.ts](src/utils/convertProfilesToSelectOptions.ts)

6. **Initialize Form**
   - React Hook Form initialized with validation schema
   - Schema in [src/features/profiles/forms/Follow/followProfileSchema.ts](src/features/profiles/forms/Follow/followProfileSchema.ts)
   - Validation rules:
     - `follow_profile` field must be non-empty (profile ID required)
     - Validated on every keystroke (`mode: "onChange"`)

---

### Part 3: Profile Selection

7. **Render Dropdown**
   - ProfileSelectInput component displays user's available profiles
   - Component in [src/components/Inputs/ProfileSelectInput/ProfileSelectInput.tsx](src/components/Inputs/ProfileSelectInput/ProfileSelectInput.tsx)
   - Uses Radix UI Select dropdown with:
     - User's profiles with avatars
     - Profile username and game type displayed
     - Check mark on selected profile

8. **User Selects Profile**
   - User clicks dropdown trigger to see available options
   - User selects one of their profiles
   - React Hook Form Controller updates field value
   - Validation runs automatically

---

### Part 4: Form Submission

9. **User Submits Form**
   - User clicks "Continue" button to submit form
   - Form validates selected profile ID against schema
   - If validation fails, error message shown under dropdown

10. **Trigger RTK Query Mutation**
    - On success, calls `followProfile` mutation
    - Mutation in [src/store/rtkQueryAPI/profileApi.ts](src/store/rtkQueryAPI/profileApi.ts)
    - Passes parameters:
      - `userId` - Current user's account ID
      - `followerProfileId` - Selected profile from form
      - `followingProfileId` - Profile being followed

---

### Part 5: Backend Service & Database

11. **Service Layer Call**
    - Mutation calls `followProfileService`
    - Service in [src/services/profile.service.ts](src/services/profile.service.ts)
    - Authenticates user via `userId`
    - Validates parameters are present

12. **Insert Follow Relationship**
    - Service inserts row into `profile_follows` table with:
      - `follower_account_id` - Account ID doing the following
      - `follower_id` - User's profile doing the following
      - `following_id` - Profile being followed
    - Database configured with cascading deletes on profile deletion

13. **Return Success**
    - Service returns `true` on successful insertion
    - Any Supabase error is thrown and caught by error handler

---

### Part 6: Cache Invalidation & Success

14. **Invalidate Related Queries**
    - RTK Query invalidates these cache tags:
      - `Followers` for the followed profile
      - `Following` for the current user
      - `IsFollowing` status check
    - Effect: Automatic refetch of follower lists and follow status

15. **Show Success Feedback**
    - Success toast displayed to user
    - Message: "Now following Profile."
    - Modal closes automatically
    - Follow button on profile page updates to show "Unfollow"

---

## Potential Issues/Edge Cases

### Selection Step

- **No Profiles**
  - User has account but no profiles
  - Shows "NoProfile" modal instead of follow form
  - User must create profile first

- **Validation Error**
  - No profile selected
  - Inline validation error shown: "Please select a profile to follow."
  - Continue button remains disabled

### Follow Submission

- **Generic Service Error**
  - Code: `FOLLOW_FAILED`
  - Handled by `handleSupabaseError`
  - Shows error modal with generic message
  - User can retry

- **Already Following**
  - Prevents duplicate follows at service level
  - Shows appropriate error message

### Edge Cases

- **Rapid Clicks**
  - Multiple clicks on Follow button trigger multiple modals
  - RTK Query handles duplicate requests intelligently
  - Cache invalidation ensures consistency
