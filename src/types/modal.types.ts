import ExistingAccount from "../features/auth/modals/errors/ExistingAccount/ExistingAccount";
import ServerError from "../features/auth/modals/errors/SeverError/ServerError";
import TooManyAttempts from "../features/auth/modals/errors/AttemptMax/AttemptMax";
import RequestMax from "../features/auth/modals/errors/RequestMax/RequestMax";
import AccountVerified from "../features/auth/modals/success/AccountVerifed/AccountVerified";
import CodeResent from "../features/auth/modals/success/CodeResent/CodeResent";
import IncorrectCred from "../features/auth/modals/errors/IncorrectCred/IncorrectCred";
import UnverifiedAccount from "../features/auth/modals/errors/UnverifiedAccount/UnverifiedAccount";
import AccountSuspended from "../features/auth/modals/errors/AccountSuspended/AccountSuspended";
import ExistingEmail from "@/features/panels/account/modals/errors/ExistingEmail/ExistingEmail";

// -- Modal Types & Variants -- //

export type MODAL_TYPES = 'EXISTING_ACCOUNT' | 'SERVER_ERROR' | 'ATTEMPT_MAX' | 'REQUEST_MAX' | 'CODE_RESENT' | 'ACCOUNT_VERIFIED' | 'INCORRECT_CRED' | 'ACCOUNT_UNVERIFIED' | 'ACCOUNT_SUSPENDED' | 'EXISTING_EMAIL';

export const modalVariants: Record<MODAL_TYPES, React.FC> = {
  EXISTING_ACCOUNT: ExistingAccount,
  EXISTING_EMAIL: ExistingEmail,
  SERVER_ERROR: ServerError,
  ATTEMPT_MAX: TooManyAttempts,
  REQUEST_MAX: RequestMax,
  INCORRECT_CRED: IncorrectCred,
  CODE_RESENT: CodeResent,
  ACCOUNT_VERIFIED: AccountVerified,
  ACCOUNT_UNVERIFIED: UnverifiedAccount,
  ACCOUNT_SUSPENDED: AccountSuspended,
};