import ExistingAccount from "./errors/ExistingAccount/ExistingAccount";
import ServerError from "./errors/SeverError/ServerError";
import TooManyAttempts from "./errors/AttemptMax/AttemptMax";
import RequestMax from "./errors/RequestMax/RequestMax";
import AccountVerified from "./success/AccountVerifed/AccountVerified";
import CodeResent from "./success/CodeResent/CodeResent";

export type MODAL_TYPES = 'EXISTING_ACCOUNT' | 'SERVER_ERROR' | 'ATTEMPT_MAX' | 'REQUEST_MAX' | 'CODE_RESENT' | 'ACCOUNT_VERIFIED';

export const modalVariants: Record<MODAL_TYPES, React.FC> = {
  EXISTING_ACCOUNT: ExistingAccount,
  SERVER_ERROR: ServerError,
  ATTEMPT_MAX: TooManyAttempts,
  REQUEST_MAX: RequestMax,
  CODE_RESENT: CodeResent,
  ACCOUNT_VERIFIED: AccountVerified,
};