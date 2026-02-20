# Search Profile Flow

## Steps

### Part 1: Search Modal Opens

1. **Navigate to Search**
   - User accesses search from two places:
     - **Profiles Panel:** Click "Search" button in actions
     - **Global Navigation:** Click search icon in navbar
   - Search modal component in [src/features/search/forms/SearchForm.tsx](src/features/search/forms/SearchForm.tsx)
  - When opened from the Profiles panel, `closePanel` is passed into the form
  - Panel trigger in [src/features/panels/profiles/ProfilesPanel.tsx](src/features/panels/profiles/ProfilesPanel.tsx)
   - Modal opens with three tabs: Profiles, Squads, Leagues

2. **Lock Body Scroll**
   - `useLockBodyScroll` hook prevents background scrolling
   - Applied to keep focus on search modal
   - Hook in [src/hooks/useLockBodyScroll.ts](src/hooks/useLockBodyScroll.ts)

3. **Initialize Form**
   - React Hook Form initialized with empty search field
   - Default value: `{ search: "" }`
   - Empty state message shown initially

---

### Part 2: User Types Query

4. **Enter Search Term**
   - User types in search input field
   - Component in [src/components/Inputs/SearchInput/SearchInput.tsx](src/components/Inputs/SearchInput/SearchInput.tsx)
   - Placeholder text: "Start typing to search..."

5. **Debounce Search Input**
   - Raw input is debounced with 300ms delay
   - Utility in [src/hooks/useDebounce.ts](src/hooks/useDebounce.ts)
   - Prevents excessive API calls while user is still typing
   - Waits for user to pause before querying

6. **Watch Search Field**
   - `useWatch` hook monitors search field value
   - Real-time updates to component state
   - Triggers debounce and query logic

---

### Part 3: Query Profiles

7. **Check Active Tab**
   - System checks which tab user is on
   - Only runs profile query if tab is "Profiles"
   - Other tabs (Squads, Leagues) show "Coming Soon" message

8. **Get User Context**
   - Authenticated user ID retrieved via `useAuth`
   - Used to exclude current user's profiles from results
   - Only returns profiles from other users

9. **Call RTK Query**
   - `useProfiles` hook triggers `getProfiles` query
   - Hook in [src/hooks/rtkQuery/queries/useProfiles.ts](src/hooks/rtkQuery/queries/useProfiles.ts)
   - Query in [src/store/rtkQueryAPI/profileApi.ts](src/store/rtkQueryAPI/profileApi.ts)
   - Passes parameters:
     - `userId` - Current user's account ID
     - `search` - Debounced search term
     - `activeTab` - Current tab selection

---

### Part 4: Backend Service

10. **Service Layer Call**
    - RTK Query calls `getAllProfiles` service
    - Service in [src/services/profile.service.ts](src/services/profile.service.ts)

11. **Build Database Query**
    - Starts with base query: `select * from profiles`
    - Applies filters in order:
      - **Search Filter:** Uses `ilike` for case-insensitive username match with wildcard: `%${search}%`
      - **Exclusion Filter:** Excludes current user via `neq("account_id", currentUserId)`
      - **Abort Signal:** Attaches abort signal to cancel query on user input change

12. **Return Results**
    - Service returns array of matching profiles
    - Each profile includes:
      - `id`, `username`, `game_type`, `avatar_type`, `avatar_value`
      - Avatar URLs already resolved to public URLs
    - Empty array if no matches or query was aborted

---

### Part 5: Display Results

13. **Show Search States**
    - **No Input Yet:** "Start Searching" message shown
    - **Wrong Tab:** "Coming Soon" message shown (for Squads/Leagues)
    - **Loading:** "Searching..." message shown
    - **Error:** "Something went wrong" message shown
    - **Results Found:** ProfileCard components displayed in grid

14. **Render Profile Cards**
    - Each result displayed as ProfileCard component
    - Card size: `small`
    - Shows:
      - Avatar (preset or upload)
      - Username
      - Game type
    - Component in [src/components/Cards/ProfileCard/ProfileCard.tsx](src/components/Cards/ProfileCard/ProfileCard.tsx)

---

### Part 6: Profile Navigation

15. **User Clicks Profile**
    - User clicks on result ProfileCard
    - `handleNavigateToProfile` triggered

16. **Navigate to Profile**
    - App navigates to `/profile/{profileId}`
    - Search modal closes
  - If search was opened from the Profiles panel, the panel also closes
    - Profile page loads with selected profile

---

## Potential Issues/Edge Cases

### Search Input

- **Empty Search**
  - No results shown
  - "Start Searching" message displayed
  - No API call made

- **Rapid Typing**
  - Debounce prevents duplicate queries
  - Only latest search term is queried after 300ms pause
  - Previous requests aborted if new input arrives

### Query Results

- **Own Profile**
  - Current user's profiles are excluded via `neq("account_id", currentUserId)`
  - User cannot search for their own profiles here

- **Case Insensitive**
  - Search uses `ilike` (case-insensitive)
  - "MyGame" and "mygame" return same results

- **Partial Match**
  - Wildcard matching with `%${search}%`
  - "john" matches "john_doe", "johnny", "john123"

### Tab Switching

- **Tab Change**
  - Clicking Squads or Leagues shows "Coming Soon"
  - Search value persists but queries are skipped
  - Switching back to Profiles re-runs query

### Network Errors

- **Abort Error**
  - Standard Supabase abort code: "ABORT"
  - Returns empty array gracefully (not an error state)
  - User sees no results

- **Generic Service Error**
  - Code: `SEARCH_FAILED`
  - Shows error message modal
  - User can retry by searching again

### Performance

- **Large Result Sets**
  - No pagination implemented
  - All matching profiles loaded at once
  - RTK Query caches results per search term
