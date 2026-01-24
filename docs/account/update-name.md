# Update Name Flow

## Steps

1. **Navigate to Account Panel**
   - User clicks account icon or navigates to account settings
   - Account panel opens displaying user information

2. **Open Update Name Modal**
   - Account panel displays "Name" option under "Information" section
   - Current name shown as helper text: "{firstName} {lastName}"
   - User clicks Edit icon next to Name option
   - "Edit Account Name" modal opens

3. **Enter New Name Information**
   - Form pre-populated with current values:
     - **First Name** (required, 1-64 characters)
     - **Last Name** (required, 1-64 characters)
   - User modifies first name and/or last name
   - User can click "Cancel" to close modal without saving

4. **Form Validation**
   - System validates first name is provided and within length limits (1-64 characters)
   - System validates last name is provided and within length limits (1-64 characters)
   - System displays inline validation errors if any

5. **Update Name**
   - User clicks "Save" button
   - System dispatches updateProfileNameThunk action
   - System updates profiles table with new first_name and last_name
   - System updates Redux store with new profile data

6. **Update Success**
   - Modal closes automatically
   - Success toast displays: "Account Name updated."
   - Account panel reflects updated name
   - Changes persist across app

## Potential Issues/Edge Cases

### During Update (Step 5)

- **Name Update Fails**
  - Code: `SERVER_ERROR`
  - Status: 500
  - System shows "Name Change Failed" modal
  - Modal message: "Please try again."
  - User can click "Okay" to dismiss modal

- **Profile Not Found**
  - Code: `NOT_FOUND`
  - Status: 404
  - Update fails if user profile doesn't exist in database
  - Shows "Name Change Failed" modal

### General Errors

- **Database Update Error**
  - Any Supabase database error triggers failure state
  - Shows "Name Change Failed" modal
  - User can retry operation

- **Network Errors**
  - Connection issues during update
  - Shows "Name Change Failed" modal
  - Changes not persisted

## Key Implementation Details

- Minimum 1-second loading delay for better UX during update
- Form pre-populated with current profile values using `defaultValues`
- Uses