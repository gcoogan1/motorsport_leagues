# Reset Password Flow

## Steps

### Part 1: Request Password Reset

1. **Navigate to Reset Password**
   - User clicks "Forgot Password?" from login page
   - System redirects to `/reset-password?status=verify` page
   - System clears any existing auth session

2. **Enter Email Address**
   - User provides **email address** (required, valid email format, max 128 characters)
   - Helper message displays: "If an account exists with this email, we'll send you a verification code."

3. **Form Validation**
   - System validates email format and length
   - System displays inline validation errors if any

4. **Send Verification Code**
   - System stores email in localStorage as `pending_email`
   - System invokes send-code function with email and purpose `reset_password`
   - System sends verification code to user's email (if account exists and is verified)
   - User redirects to `/verify-account?purpose=reset_password` page
   - **Note:** System always navigates to verification page regardless of success/failure to prevent account enumeration

### Part 2: Verify Email with Code

5. **Enter Verification Code**
   - User receives verification code via email (if account exists and is verified)
   - Page displays: "If an account exists with the email, {email}, you'll receive a verification code. Enter it below to reset your password."
   - User enters 6-digit verification code on verify account page
   - User can click "Resend Code" to receive a new code

6. **Code Verification**
   - System validates the code via verify-code function
   - If code is incorrect, inline error displays: "Incorrect code. Please try again."
   - If successful, user redirects to `/reset-password?status=new_password`

### Part 3: Create New Password

7. **Enter New Password**
   - User creates **new password** (required, 8-64 characters)
   - Helper text displays: "Minimum of 8 characters."
   - System retrieves email from localStorage `pending_email`

8. **Update Password**
   - System invokes update-password function with new password and email
   - System validates new password is different from previous password

9. **Password Reset Success**
   - Page updates to show "Successfully Updated" message
   - Helper message: "Your password has been changed."
   - User clicks "Go to Log in" button
   - System clears `pending_email` from localStorage
   - User redirects to `/login` page

## Potential Issues/Edge Cases

### During Email Entry (Step 4)

- **Unverified Account**
  - Code: `UNVERIFIED_ACCOUNT`
  - Status: 403
  - System shows "Your Account Is Unverified" modal
  - Modal message: "Please verify your email, {email}, to finalize creating your account."
  - User can click "Verify" to:
    - Send new verification code for signup
    - Navigate to `/verify-account?purpose=signup`
  - User can click "Cancel" to dismiss modal
  - User must complete account verification before resetting password

- **Account Does Not Exist**
  - System navigates to verification page regardless
  - User will not receive a code
  - Prevents information leakage about account existence
  - User can attempt to enter code but will fail validation

- **Too Many Code Requests**
  - Code: `REQUEST_MAX`
  - Status: 429
  - System navigates to verification page
  - User can still attempt resend from verification page
  - Will show "Request Max" error modal: "Please wait a minute before requesting a new code."
  - Displays when user requests verification code 5 consecutive times
  - User must wait 1 minute before requesting another code

- **Server/Network Errors (During Send)**
  - System navigates to verification page regardless of error
  - Prevents information leakage about account existence
  - User will not receive code if error occurred
  - Generic error handling only for critical failures via `handleSupabaseError`

### During Code Verification (Step 6)

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

- **Too Many Code Requests (During Resend)**
  - Code: `REQUEST_MAX`
  - Status: 429
  - System shows "Request Max" error modal
  - Message: "Please wait a minute before requesting a new code."
  - Displays when user clicks "Resend Code" 5 consecutive times
  - User must wait 1 minute before requesting another code

- **Code Resent Successfully**
  - "Code Resent" success modal displays
  - Confirms code sent to user's email address

### During New Password Creation (Step 8)

- **Same Password as Previous**
  - Code: `SAME_PASSWORD`
  - Status: 409
  - System shows error modal
  - Message: "New password cannot be the same as the previous password."
  - User must choose a different password

- **Missing Email in localStorage**
  - Code: `SERVER_ERROR`
  - Status: 500
  - Generic error modal displays
  - User may need to restart reset password flow

### General Errors

- **Server/Network Errors**
  - Generic error handling via `handleSupabaseError` utility
  - Displays appropriate error modal based on error code

## Key Implementation Details

- Minimum 1-second loading delay for better UX during verification code send and password update
- Auth session is cleared when entering reset password flow
- Email stored in localStorage (`pending_email`) to persist across page navigations
- Uses same verification component as signup flow, differentiated by `purpose=reset_password`
- Verification flow enforces rate limiting on both requests and attempts
- Password update validates against previous password to prevent reuse
- Three-step process: Email Entry → Code Verification → New Password
- **Always navigates to verification page after email submission** (success or most failures) to prevent account enumeration
- Only UNVERIFIED_ACCOUNT error shows modal instead of navigating

## Security Features

- **Account enumeration prevention**: Always navigates to verification page regardless of whether account exists
- Helper text uses conditional language: "If an account exists with this email..."
- Rate limiting on code requests (REQUEST_MAX): 5 requests, then 1-minute timeout
- Rate limiting on code attempts (ATTEMPT_MAX): 5 attempts, then 5-minute timeout
- Password history validation prevents password reuse (SAME_PASSWORD)
- Email verification required before password reset
- Verification codes expire after set time period
- Auth session cleared at start of reset flow for security
- Only verified accounts can reset passwords (UNVERIFIED_ACCOUNT check)