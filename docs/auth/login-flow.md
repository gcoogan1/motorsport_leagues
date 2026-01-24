# Login Flow

## Steps

1. **Navigate to Login**
   - User clicks "Log In" button from homepage or navigation
   - System redirects to `/login` page

2. **Enter Credentials**
   - User provides **email address** (required, valid email format, max 128 characters)
   - User provides **password** (required, 8-64 characters)

3. **Form Validation**
   - System validates email format and length
   - System validates password meets minimum length requirement (8 characters)
   - System displays inline validation errors if any

4. **Authentication Process**
   - System clears any pending email from localStorage
   - System invokes login proxy function with credentials
   - System verifies credentials against Supabase Auth
   - System establishes session with access and refresh tokens
   - System fetches user profile from profiles table
   - System checks profile `is_verified` flag

5. **Login Success**
   - User is redirected to homepage (`/`)
   - Auth context is updated with user session
   - User can access authenticated features

## Potential Issues/Edge Cases

### During Authentication (Step 4)

- **Incorrect Email or Password**
  - Code: `INCORRECT_CRED`
  - Status: 403
  - System shows "Incorrect Email or Password" modal
  - Modal message: "You've entered incorrect credentials. Try again or reset your password."
  - User can click "Try Again" to dismiss modal or "Reset Password" to navigate to `/reset-password?status=verify`
  - User will be timed-out for 5 minutes if they fail 5 consecutive times (see ATTEMPT_MAX below)

- **Too Many Login Attempts**
  - Code: `ATTEMPT_MAX`
  - Status: 429
  - System shows "Attempt Max" error modal
  - Message: "Too many login attempts. Please try again later."
  - Displays when user fails login 5 consecutive times
  - Rate limiting based on user's IP address and email
  - User must wait 5 minutes before attempting login again

- **Unverified Account**
  - Code: `EMAIL_NOT_VERIFIED`
  - Status: 401
  - System shows "Your Account Is Unverified" modal
  - Modal message: "Please verify your email, {email}, to finalize creating your account."
  - User can click "Verify" to:
    - Send new verification code
    - Navigate to `/verify-account?purpose=signup`
  - User can click "Cancel" to dismiss and stay on login page

- **Account Suspended/Banned**
  - Code: `user_banned`
  - Status: 400
  - System shows "Account Suspended" modal
  - Modal message: "Your account is no longer allowed on the platform."
  - User can only acknowledge and close modal

### During Verification Flow (If Triggered)

- **Too Many Code Requests**
  - Code: `REQUEST_MAX`
  - Status: 429
  - System shows "Request Max" error modal
  - Message: "Too many requests. Please try again in 1 minute."
  - Displays when user requests verification code 5 consecutive times
  - User must wait 1 minute before requesting another code

- **Too Many Code Attempts**
  - Code: `ATTEMPT_MAX`
  - Status: 429
  - System shows "Attempt Max" error modal
  - Message: "Too many attempts. Please request a new code."
  - Displays when user inputs incorrect code 5 times
  - User must wait 5 minutes or request a new code

### System Errors

- **Profile Fetch Fails**
  - Code: `PROFILE_FETCH_FAILED`
  - Status: 500
  - Login process fails even if credentials are correct
  - Generic error handling via `handleSupabaseError` utility

- **Session Establishment Fails**
  - Code: `SERVER_ERROR`
  - Status: 500
  - Message: "Failed to establish session."
  - User cannot complete login

- **Server/Network Errors**
  - Generic error handling via `handleSupabaseError` utility
  - Displays appropriate error modal based on error code

## Key Implementation Details

- Minimum 1-second loading delay for better UX during login
- Uses login proxy function (not direct Supabase Auth) for enhanced security and rate limiting
- Session established using access and refresh tokens from login proxy response
- Users must have verified email (`is_verified: true`) to successfully log in
- Clears pending email from localStorage on login attempt
- "Forgot Password?" link navigates to `/reset-password?status=verify`
- Login form includes both email and password validation before submission

## Security Features

- Login proxy provides centralized authentication control
- Rate limiting on login attempts (ATTEMPT_MAX): 5 attempts, then 5-minute timeout based on IP and email
- Rate limiting on verification code requests (REQUEST_MAX): 5 requests per minute
- Rate limiting on verification code attempts (ATTEMPT_MAX): 5 attempts, then 5-minute timeout
- Email verification required before account access
- Account suspension/banning capability (user_banned)
- Session token management for secure authentication state