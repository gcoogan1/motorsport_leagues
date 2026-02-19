import ExistingAccount from "../features/auth/modals/errors/ExistingAccount/ExistingAccount";
import ServerError from "../features/auth/modals/errors/SeverError/ServerError";
import TooManyAttempts from "../features/auth/modals/errors/AttemptMax/AttemptMax";
import RequestMax from "../features/auth/modals/errors/RequestMax/RequestMax";
import AccountVerified from "../features/auth/modals/success/AccountVerifed/AccountVerified";
import IncorrectCred from "../features/auth/modals/errors/IncorrectCred/IncorrectCred";
import AccountSuspended from "../features/auth/modals/errors/AccountSuspended/AccountSuspended";
import ExistingEmail from "@/features/panels/account/modals/errors/ExistingEmail/ExistingEmail";
import IncorrectPassword from "@/features/panels/account/modals/errors/IncorrectPassword/IncorrectPassword";
import SamePassword from "@/features/auth/modals/errors/SamePassword/SamePassword";
import NoProfile from "@/features/profiles/modals/core/NoProfile/NoProfile";

// -- Modal Types & Variants -- //

// Modals that do not require props

export type MODAL_TYPES = 'EXISTING_ACCOUNT' | 'SERVER_ERROR' | 'ATTEMPT_MAX' | 'REQUEST_MAX' | 'ACCOUNT_VERIFIED' | 'INCORRECT_CRED' | 'ACCOUNT_SUSPENDED' | 'EXISTING_EMAIL' | 'INCORRECT_PASSWORD' | 'SAME_PASSWORD' | 'NO_PROFILE';

// Additional modals that may require props can be added here
export type OTHER_MODAL_TYPES = 'UNVERIFIED_ACCOUNT' | 'CODE_RESENT' | 'PROFILE_CREATED' | 'EXISTING_USERNAME' | 'UNFOLLOW' | 'REMOVE_FOLLOWER';

// Combine all modal types
export type ALL_MODAL_TYPES = MODAL_TYPES | OTHER_MODAL_TYPES;

// Map modal types to their corresponding components for those WITHOUT props
export const modalVariants: Record<MODAL_TYPES, React.FC> = {
  EXISTING_ACCOUNT: ExistingAccount,
  EXISTING_EMAIL: ExistingEmail,
  SERVER_ERROR: ServerError,
  ATTEMPT_MAX: TooManyAttempts,
  REQUEST_MAX: RequestMax,
  INCORRECT_CRED: IncorrectCred,
  ACCOUNT_VERIFIED: AccountVerified,
  ACCOUNT_SUSPENDED: AccountSuspended,
  INCORRECT_PASSWORD: IncorrectPassword,
  SAME_PASSWORD: SamePassword,
  NO_PROFILE: NoProfile,
};