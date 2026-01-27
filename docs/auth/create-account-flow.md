# Create Account Flow

## Steps

### Part 1: Registration

1. **Navigate to Registration**
   - User clicks "Get started" button
   - System redirects to `/create-account` page

2. **Enter Account Information**
   - User provides **first name** (required, 1-64 characters)
   - User provides **last name** (required, 1-64 characters)
   - User provides **email address** (required, valid email format, max 128 characters)
   - User creates **password** (required, 8-64 characters)

3. **Form Validation**
   - System validates email format and length
   - System checks password meets minimum length requirement (8 characters)
   - System validates first name and last name are provided and within length limits
   - System displays inline validation errors if any
   - **No password strength complexity requirements** (only length)
   - **No password match verification** (single password field only)

4. **Account Creation**
   - System clears any pending email from localStorage
   - System creates user account in Supabase Auth
   - System automatically creates user account in accounts table with:
     - User ID
     - Email
     - First name
     - Last name
     - `is_verified: false` flag
   - System automatically sends verification code via email
   - User redirects to `/verify-account?purpose=signup` page

### Part 2: Email Verification

5. **Enter Verification Code**
   - User receives verification code via email
   - Page displays: "We've sent a verification code to you at {email}. Enter it below to finish creating your account."
   - User enters 6-digit verification code on verify account page
   - User can click "Resend Code" to receive a new code

6. **Code Verification**
   - System validates the code via verify-code function
   - If code is incorrect, inline error displays: "Incorrect code. Please try again."
   - If successful, system marks account as verified

7. **Account Verification Success**
   - System updates account `is_verified` flag to `true`
   - User is redirected to homepage (`/`)
   - Auth context is refreshed to reflect verified status
   - "Account Verified!" success modal displays with message: "Your account has been successfully verified. Welcome to Motorsport Leagues."

## Potential Issues/Edge Cases

### During Registration (Step 4)

- **Email Already Registered**
  - Status: 422
  - System shows "Existing Account" modal
  - Modal message: "An account already exists with this email. Go to log in with this email address, or reset your password."
  - User can click "Go to Log In" to navigate to login page or "Close" to dismiss

- **Account Creation Fails**
  - Code: `ACCOUNT_CREATION_FAILED`
  - Status: 500
  - If auth signup succeeds but account creation fails, returns error
  - Generic error handling via `handleSupabaseError` utility

- **Verification Code Send Fails**
  - System attempts to send verification code after successful signup
  - If send fails, error is thrown and user cannot proceed to verification

### During Code Verification (Step 6)

- **Invalid/Expired Verification Code**
  - Code: `INVALID_OR_EXPIRED_CODE`
  - Status: 400
  - Inline error: "Incorrect code. Please try again."
  - User can request new code via "Resend Code" button

- **Too Many Code Requests**
  - Code: `REQUEST_MAX`
  - Status: 429
  - System shows "Request Max" error modal
  - Message: "Please wait a minute before requesting a new code."
  - Displays when user requests verification code 5 consecutive times
  - User must wait 1 minute before requesting another code

- **Too Many Code Attempts**
  - Code: `ATTEMPT_MAX`
  - Status: 429
  - System shows "Attempt Max" error modal
  - Message: "Please wait a few minutes before trying again."
  - Displays when user inputs incorrect code 5 times
  - User must wait 5 minutes or request a new code

- **Code Resent Successfully**
  - "Code Resent" success modal displays
  - Confirms code sent to user's email address

### General Errors

- **Missing Email During Verification**
  - Email retrieved from user object (from auth context) for signup flow
  - Generic server error shown if email unavailable

- **Server/Network Errors**
  - Generic error handling via `handleSupabaseError` utility
  - Displays appropriate error modal based on error code

## Key Implementation Details

- Minimum 1-second loading delay for better UX during signup
- Clears any pending email from localStorage on signup attempt
- Account is created with `is_verified: false` initially
- Users cannot log in until email is verified (checked during login flow)
- Verification flow uses same component for both signup and password reset purposes
- Two-step process: Registration → Email Verification

## Security Features

- Rate limiting on code requests (REQUEST_MAX): 5 requests, then 1-minute timeout
- Rate limiting on code attempts (ATTEMPT_MAX): 5 attempts, then 5-minute timeout
- Email verification required before account access
- Verification codes expire after set time period
- Account verification flag enforced during login
- Duplicate email prevention (EXISTING_ACCOUNT check)