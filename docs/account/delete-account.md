# Delete Account Flow

## Steps

1. **Navigate to Account Panel**
   - User clicks account icon or navigates to account settings
   - Account panel opens displaying user information

2. **Open Delete Account Modal**
   - Account panel displays "Delete Account" option under "Management" section
   - Delete icon indicates destructive action
   - User clicks on Delete Account option
   - "Delete Account" modal opens with warning message

3. **Review Warning Information**
   - Modal displays comprehensive warning:
     - "Your entire account, including your Profiles, will be deleted and unrecoverable."
     - "Squads that you are the sole Founder of, and Leagues that you are the only Director of, will also be deleted."
     - "All data that you contributed to a Squad or League, including your results, will remain there until deleted."
   - Bold instruction: "Please type "delete account" below to confirm."

4. **Enter Confirmation Text**
   - User must type exactly **"delete account"** in the confirmation field (case-insensitive, trimmed)
   - Placeholder shows: "delete account"
   - User can click "Cancel" to abort deletion

5. **Form Validation**
   - System validates confirmation text matches exactly "delete account"
   - If text doesn't match, inline error displays: "Please type in "delete account" to confirm."
   - System displays validation error before allowing submission

6. **Delete Account**
   - User clicks "Delete Account" button (shown in danger/red styling)
   - System invokes delete-account function with user ID
   - System performs account deletion via Supabase function

7. **Deletion Success**
   - Auth context is reset (user logged out)
   - Modal closes automatically
   - Account panel closes
   - User redirected to homepage (`/`)
   - User must create new account to use platform again

## Potential Issues/Edge Cases

### During Deletion (Step 6)

- **Account Deletion Fails**
  - Code: `SERVER_ERROR`
  - Status: 500
  - Inline error message displays on confirmation field
  - Message: Custom error message or "Failed to delete account."
  - Modal remains open for retry

- **Network/Server Errors**
  - Generic error handling via `handleSupabaseError` utility
  - Displays appropriate error modal
  - User can retry deletion

### General Considerations

- **Irreversible Action**
  - No way to recover account once deleted
  - All profile data permanently removed
  - Squads/Leagues where user is sole owner also deleted
  - User contributions to other squads/leagues remain

## Key Implementation Details

- Minimum 1-second loading delay for better UX during deletion
- Confirmation text validation case-insensitive and trimmed for user flexibility
- Exact string match required: "delete account"
- Auth reset immediately after successful deletion
- Panel and modal both close on success
- User redirected to homepage after deletion
- Delete button styled with danger variant (red) to indicate destructive action
- No toast notification on success (user logged out and redirected)

## Security Features

- Explicit text confirmation required to prevent accidental deletion
- Server-side deletion via Supabase function for data integrity
- Auth session cleared immediately after deletion
- User ID required for deletion operation
- Comprehensive warning message about data loss

## UI/UX Features

- Modal displays detailed warning about consequences
- Bold text emphasizes confirmation requirement
- Placeholder text guides user on exact input needed
- Cancel button always available to abort process
- Danger-styled button indicates irreversible action
- Loading state prevents duplicate submissions
- Inline validation feedback for confirmation text
- Error messages displayed on confirmation field for retry clarity

## Data Deletion Scope

### Deleted:
- User account (Supabase Auth)
- User profile (profiles table)
- Squads where user is sole Founder
- Leagues where user is only Director

### Retained:
- User contributions to Squads/Leagues (results, data)
- Squads/Leagues with multiple Founders/Directors