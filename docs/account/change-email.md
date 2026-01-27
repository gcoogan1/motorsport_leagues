# Change Email Flow

## Steps

### Part 1: Enter New Email Address

1. **Navigate to Account Panel**
   - User clicks account icon or navigates to account settings
   - Account panel opens displaying user information

2. **Open Change Email Modal**
   - Account panel displays "Email" option under "Authentication" section
   - Current email shown as helper text: "{current email}"
   - User clicks Edit icon next to Email option
   - "Change Email" modal opens

3. **Enter New Email Address**
   - Form pre-populated with current email value
   - Helper message displays: "Enter a new email address to associate with your Motorsport Leagues account. We'll send a verification code to this email."
   - User enters **new email address** (required, valid email format, max 128 characters)
   - User can click "Cancel" to close modal without changes

4. **Form Validation**
   - System validates email format
   - System validates email length (max 128 characters)
   - System displays inline validation errors if any

5. **Send Verification Code**
   - User clicks "Send Code" button
   - System invokes send-code function with new email and purpose `change_email`
   - System sends verification code to new email address
   - "Check Your Email" modal opens

### Part 2: Verify New Email Address

6. **Enter Verification Code**
   - Modal displays: "We've sent a verification code to your new email address, {newEmail}. Enter the code below to finalize changing your account's email address."
   - User enters 6-digit verification code
   - User can click "Resend Code" button to receive new code
   - User can click "Cancel" to abort email change

7. **Code Verification**
   - System validates the code via verify-code function
   - If code is incorrect, inline error displays: "Incorrect code. Please try again."
   - If successful, system proceeds to email update

8. **Update Email**
   - System invokes change-email function with new email and user ID
   - System updates both Supabase Auth email and accounts table email
   - System refreshes account data in Redux store

9. **Update Success**
   - Modal closes automatically
   - Success toast displays: "Email Address updated."
   - Account panel reflects updated email
   - Changes persist across app

## Potential Issues/Edge Cases

### During Code Send (Step 5)

- **Email Already In Use**
  - Code: `EXISTING_EMAIL`
  - Status: 409
  - System shows "Existing Account" modal
  - Modal message: "An account already exists with this email."
  - User can click "Okay" to dismiss modal

- **Too Many Code Requests**
  - Code: `REQUEST_MAX`
  - Status: 429
  - System shows "Request Max" error modal
  - Message: "Please wait a minute before requesting a new code."
  - Displays when user requests verification code 5 consecutive times
  - User must wait 1 minute before requesting another code

### During Code Verification (Step 7)

- **Invalid/Expired Verification Code**
  - Code: `INVALID_OR_EXPIRED_CODE`
  - Status: 400
  - Inline error: "Incorrect code. Please try again."
  - User can request new code via "Resend Code" button

- **Too Many Code Attempts**
  - Code: `ATTEMPT_MAX`
  - Status: 429
  - System shows "Attempt Max" error modal
  - Message: "Please wait a few minutes before trying again."
  - Displays when user inputs incorrect code 5 times
  - User must wait 5 minutes or request a new code

- **Code Resent Successfully**
  - "Code Resent" success modal displays
  - Confirms code sent to new email address
  - User clicks "Continue" to return to Check Email modal

### During Email Update (Step 8)

- **Email Update Fails**
  - Code: `SERVER_ERROR`
  - Status: 500
  - Generic error handling via `handleSupabaseError` utility
  - Modal remains open for retry

### General Errors

- **Server/Network Errors**
  - Generic error handling via `handleSupabaseError` utility
  - Displays appropriate error modal based on error code

## Key Implementation Details

- Minimum 1-second loading delay for better UX during code send and verification
- Form pre-populated with current email using `defaultValues`
- Two-step modal flow: Change Email → Check Email
- Uses same verification code system as signup and password reset
- Updates both Supabase Auth and accounts table
- Redux store refreshed after successful email change
- Toast notification confirms successful update
- Cancel button available at each step
- Resend Code button separate from main form buttons

## Security Features

- Rate limiting on code requests (REQUEST_MAX): 5 requests, then 1-minute timeout
- Rate limiting on code attempts (ATTEMPT_MAX): 5 attempts, then 5-minute timeout
- Email verification required before change is applied
- Duplicate email prevention (EXISTING_EMAIL check)
- Verification codes expire after set time period
- Changes require both code verification and database update to succeed

## UI/UX Features

- Two-step modal process for clear user guidance
- Loading states for Send Code, Submit, and Resend Code buttons
- Edit icon indicates editable field
- Helper text shows current email value
- Success feedback via toast notification
- Error feedback via modal dialogs or inline messages
- Form validation provides immediate inline feedback
- Resend Code available as ghost button within verification modal