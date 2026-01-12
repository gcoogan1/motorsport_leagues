import ExistingAccount from "./errors/ExistingAccount/ExistingAccount";
import ServerError from "./errors/SeverError/ServerError";
import TooManyAttempts from "./errors/AttemptMax/AttemptMax";
import RequestMax from "./errors/RequestMax/RequestMax";
import AccountVerified from "./success/AccountVerifed/AccountVerified";
import CodeResent from "./success/CodeResent/CodeResent";
import IncorrectCred from "./errors/IncorrectCred/IncorrectCred";
import UnverifiedAccount from "./errors/UnverifiedAccount/UnverifiedAccount";
import AccountSuspended from "./errors/AccountSuspended/AccountSuspended";

export type MODAL_TYPES = 'EXISTING_ACCOUNT' | 'SERVER_ERROR' | 'ATTEMPT_MAX' | 'REQUEST_MAX' | 'CODE_RESENT' | 'ACCOUNT_VERIFIED' | 'INCORRECT_CRED' | 'ACCOUNT_UNVERIFIED' | 'ACCOUNT_SUSPENDED';

export const modalVariants: Record<MODAL_TYPES, React.FC> = {
  EXISTING_ACCOUNT: ExistingAccount,
  SERVER_ERROR: ServerError,
  ATTEMPT_MAX: TooManyAttempts,
  REQUEST_MAX: RequestMax,
  INCORRECT_CRED: IncorrectCred,
  CODE_RESENT: CodeResent,
  ACCOUNT_VERIFIED: AccountVerified,
  ACCOUNT_UNVERIFIED: UnverifiedAccount,
  ACCOUNT_SUSPENDED: AccountSuspended,
};