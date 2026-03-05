# Edit Squad Banner Flow

## Steps

### Part 1: Open Edit Banner

1. **Open Squad Edit Panel**
   - Founder opens squad edit panel
   - Panel entry point in [src/features/panels/squadEdit/SquadEdit.tsx](src/features/panels/squadEdit/SquadEdit.tsx)

2. **Launch Edit Banner Modal**
   - User clicks “Banner Image”
   - Modal opens with `EditBanner`
   - Logic in [src/features/panels/squadEdit/forms/EditBanner/EditBanner.tsx](src/features/panels/squadEdit/forms/EditBanner/EditBanner.tsx)

---

### Part 2: Prefill & Selection

3. **Prefill Existing Banner**
   - If `banner_type` is `preset`, preload current variant
   - If `banner_type` is `upload`, preload `previewUrl` (no File object yet)
   - Prefill logic in [src/features/panels/squadEdit/forms/EditBanner/EditBanner.tsx](src/features/panels/squadEdit/forms/EditBanner/EditBanner.tsx)

4. **Select New Banner**
   - User chooses:
     - **Preset** from `SQUAD_BANNER_VARIANTS`
     - **Upload** file (max 5MB)
   - Schema in [src/features/panels/squadEdit/forms/EditBanner/editBanner.schema.ts](src/features/panels/squadEdit/forms/EditBanner/editBanner.schema.ts)

---

### Part 3: Save & Update

5. **Submit Update**
   - Dispatches `editBannerThunk`
   - Thunk in [src/store/squads/squad.thunk.ts](src/store/squads/squad.thunk.ts)

6. **Upload + Persist**
   - If upload selected, service fetches `founder_account_id` and uploads to `banners` bucket using account-scoped path
   - Updates `squads.banner_type` and `squads.banner_value`
   - Resolves uploaded value to public URL before returning
   - Service in [src/services/squad.service.ts](src/services/squad.service.ts)

7. **Success**
   - Success toast: “Squad’s Banner updated.”
   - Modal closes
   - Flow in [src/features/panels/squadEdit/forms/EditBanner/EditBanner.tsx](src/features/panels/squadEdit/forms/EditBanner/EditBanner.tsx)

---

## Potential Issues/Edge Cases

### Banner Selection

- **Upload Too Large**
  - Max 5MB validation error

- **No New File for Upload Type**
  - If upload type has no file selected, submit closes modal without update

### Update Errors

- **Squad Not Found**
  - Code: `SQUAD_NOT_FOUND`

- **Upload Failed**
  - Code: `UPLOAD_FAILED`

- **Update Failed**
  - Falls back to service/database error code or `SERVER_ERROR`

---

## Key Implementation Details

- Form is `react-hook-form` + Zod with discriminated union for banner type
- Existing uploaded banner is represented via `previewUrl` until a new file is picked
- Upload path convention matches create flow (`{founderAccountId}/{uuid}.{ext}`)
- Uses `withMinDelay(1000)` for loading-state consistency

---

## Summary

Edit Squad Banner is a modal flow that:

1. Prefills current banner state
2. Accepts preset or uploaded replacement
3. Uploads (if needed) and updates squad record
4. Shows success toast and closes modal
