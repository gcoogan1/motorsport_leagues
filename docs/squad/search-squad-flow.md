# Search Squad Flow

## Steps

### Part 1: Search Entry

1. **Open Search UI**
   - User can open search from:
     - Global search entry
     - Squads panel “Find a Squad” action (starts on Squads tab)
   - Squads panel trigger in [src/features/panels/squads/SquadsPanel.tsx](src/features/panels/squads/SquadsPanel.tsx)
   - Search form in [src/features/search/forms/SearchForm.tsx](src/features/search/forms/SearchForm.tsx)

2. **Initialize Search State**
   - Tabs include `Profiles`, `Squads`, `Leagues`
   - Active tab can be set by `startingTab`
   - Form default: `{ search: "" }`

3. **Lock Background Scroll**
   - Search uses `useLockBodyScroll(true)` while open
   - Hook in [src/hooks/useLockBodyScroll.ts](src/hooks/useLockBodyScroll.ts)

---

### Part 2: Input + Debounce

4. **User Types Search**
   - Input value observed with `useWatch`
   - Debounced by 300ms via `useDebounce`
   - Hook in [src/hooks/useDebounce.ts](src/hooks/useDebounce.ts)

5. **Empty State Handling**
   - If no search term, shows “Start Searching” message
   - No squad query runs without search text

---

### Part 3: Squad Query

6. **Tab Gating**
   - Squad query only runs when:
     - user is authenticated
     - search has text
     - active tab is `Squads`
   - Hook in [src/hooks/rtkQuery/queries/useSquads.ts](src/hooks/rtkQuery/queries/useSquads.ts)

7. **RTK Query Call**
   - Uses `useGetSquadsQuery`
   - Endpoint in [src/store/rtkQueryAPI/squadApi.ts](src/store/rtkQueryAPI/squadApi.ts)
   - Passes `founderAccountId`, `search`, and `activeTab`

8. **Service Filtering**
   - `getAllSquads` applies:
     - normalized `ilike` search on `squad_name_normalized`
     - exclusion of current user’s founded squads via `neq("founder_account_id", founderAcctId)`
     - abort signal for request cancellation
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

9. **Result Shaping**
   - Adds `member_count` from joined count
   - Resolves uploaded `banner_value` to public URL

---

### Part 4: Display & Navigation

10. **Render States**
    - **No input:** “Start Searching”
    - **No matches:** “No Results”
    - **Matches:** list of `SquadCard` results

11. **Render Squad Cards**
    - Card shows squad name, member count, and banner image
    - Preset banners mapped via `getBannerVariants`

12. **Navigate to Squad**
    - Clicking a squad navigates to `/squad/{squadId}`
    - Search modal closes
    - If opened from panel, panel also closes

---

## Potential Issues/Edge Cases

### Input/Query

- **Rapid Typing**
  - Debounce reduces query volume
  - Abort signal prevents stale request races

- **Case/Format Variations**
  - Name search normalized with `normalizeName`
  - Supports case-insensitive partial matching

- **Abort Response**
  - Abort is treated as success with empty result set

### Results

- **Own Founded Squads Hidden**
  - Search intentionally excludes squads founded by current account

- **No Results**
  - Displays standard empty state message

---

## Key Implementation Details

- Search behavior is shared in a single `SearchForm` across profile/squad tabs
- Squad fetching is conditional via `skip` logic in `useSquads`
- RTK Query provides request cancellation and cache tagging
- Results are rendered with compact `SquadCard` components and routed by ID

---

## Summary

Search Squad is a debounced, tab-gated flow that:

1. Starts from global or squads-panel search entry
2. Runs squad query only on Squads tab with input
3. Returns normalized matches excluding owned squads
4. Navigates directly to selected squad from search results
