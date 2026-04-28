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
import GuestFollow from "@/features/profiles/modals/errors/GuestFollow/GuestFollow";
import ProfileCreated from "@/features/profiles/modals/success/ProfileCreated/ProfileCreated";
import NameTaken from "@/features/squads/modals/errors/NameTaken/NameTaken";
import GuestJoinSquad from "@/features/squads/modals/errors/GuestJoinSquad/GuestJoinSquad";
import SquadGuestFollow from "@/features/squads/modals/errors/SquadGuestFollow/SquadGuestFollow";
import SquadCreated from "@/features/squads/modals/success/SquadCreated/SquadCreated";
import NoSquad from "@/features/leagues/modals/errors/NoSquad/NoSquad";
import LeagueGuestFollow from "@/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow";
import LeagueNameTaken from "@/features/leagues/modals/errors/LeagueNameTaken/LeagueNameTaken";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import UnassignedParticipant from "@/features/leagues/modals/errors/UnassignedParticipant/UnassignedParticipant";
import NoDirector from "@/features/leagues/modals/errors/NoDirector/NoDirector";
import LeagueNoProfile from "@/features/leagues/modals/core/LeagueNoProfile/LeagueNoProfile";
import RequestSent from "@/features/panels/leagueJoin/modals/success/RequestSent/RequestSent";
import NameUpdateFail from "@/features/panels/account/modals/errors/NameUpdateFail/NameUpdateFail";
import CannotLeave from "@/features/panels/squadEdit/modals/error/CannotLeave/CannotLeave";

// -- Modal Types & Variants -- //

// Modals that do not require props

export type MODAL_TYPES =
  | "EXISTING_ACCOUNT"
  | "SERVER_ERROR"
  | "ATTEMPT_MAX"
  | "REQUEST_MAX"
  | "ACCOUNT_VERIFIED"
  | "INCORRECT_CRED"
  | "ACCOUNT_SUSPENDED"
  | "EXISTING_EMAIL"
  | "INCORRECT_PASSWORD"
  | "SAME_PASSWORD"
  | "NO_PROFILE"
  | "GUEST_FOLLOW"
  | "PROFILE_CREATED"
  | "NAME_TAKEN"
  | "GUEST_JOIN_SQUAD"
  | "SQUAD_GUEST_FOLLOW"
  | "SQUAD_CREATED"
  | "NO_SQUAD"
  | "LEAGUE_GUEST_FOLLOW"
  | "LEAGUE_NAME_TAKEN"
  | "CANNOT_SAVE"
  | "UNASSIGNED_PARTICIPANT"
  | "NO_DIRECTOR"
  | "LEAGUE_NO_PROFILE"
  | "REQUEST_SENT"
  | "NAME_UPDATE_FAIL"
  | "CANNOT_LEAVE";

// Additional modals that may require props can be added here
export type OTHER_MODAL_TYPES =
  | "UNVERIFIED_ACCOUNT"
  | "CODE_RESENT"
  | "EXISTING_USERNAME"
  | "UNFOLLOW"
  | "REMOVE_FOLLOWER"
  | "REMOVE_SQUAD_FOLLOWER"
  | "REMOVE_LEAGUE_FOLLOWER"
  | "SQUAD_NO_PROFILE"
  | "LEAVE_SQUAD"
  | "LEAVE_SQUAD_PICKER"
  | "JOIN_SQUAD"
  | "REMOVE_SQUAD_MEMBER"
  | "CHANGE_MEMBER_ROLE"
  | "UNFOLLOW_SQUAD"
  | "UNFOLLOW_LEAGUE"
  | "FOLLOW_SQUAD"
  | "FOLLOW_LEAGUE"
  | "LEAGUE_CREATED"
  | "LEAVE_LEAGUE"
  | "REMOVE_PARTICIPANT"
  | "SHARE_LEAGUE"
  | "HOST_SQUAD"
  | "GAME"
  | "REJECT_REQUEST"
  | "UNSAVED_CHANGES"
  | "CONTACT_INFO"
  | "VIEW_REQUEST"
  | "DELETE_LEAGUE"
  | "DELETE_SQUAD"
  | "DELETE_PROFILE"
  | "DELETE_ACCOUNT"
  | "CHANGE_EMAIL"
  | "CHECK_EMAIL"
  | "CHANGE_PASSWORD"
  | "UPDATE_NAME"
  | "EDIT_AVATAR"
  | "EDIT_USERNAME"
  | "EDIT_BANNER"
  | "EDIT_SQUAD_NAME"
  | "SEARCH_FORM"
  | "LEAGUE_NO_PROFILE_WITH_TYPE"
  | "LEAGUE_GUEST_FOLLOW_WITH_TYPE"
  | "GUEST_JOIN_SQUAD_WITH_CALLBACK"
  | "EXISTING_ACCOUNT_WITH_CONTINUE"
  | "ACCOUNT_VERIFIED_WITH_CONTINUE"
  | "INVITE_LEAGUE"


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
  GUEST_FOLLOW: GuestFollow,
  PROFILE_CREATED: ProfileCreated,
  NAME_TAKEN: NameTaken,
  GUEST_JOIN_SQUAD: GuestJoinSquad,
  SQUAD_GUEST_FOLLOW: SquadGuestFollow,
  SQUAD_CREATED: SquadCreated,
  NO_SQUAD: NoSquad,
  LEAGUE_GUEST_FOLLOW: LeagueGuestFollow,
  LEAGUE_NAME_TAKEN: LeagueNameTaken,
  CANNOT_SAVE: CannotSave,
  UNASSIGNED_PARTICIPANT: UnassignedParticipant,
  NO_DIRECTOR: NoDirector,
  LEAGUE_NO_PROFILE: LeagueNoProfile,
  REQUEST_SENT: RequestSent,
  NAME_UPDATE_FAIL: NameUpdateFail,
  CANNOT_LEAVE: CannotLeave,
};
