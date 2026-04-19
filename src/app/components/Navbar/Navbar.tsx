
import type { UserData } from "@/types/auth.types";
import CoreNavbar from "./variants/core/CoreNavbar";
import GuestNavbar from "./variants/guest/GuestNavbar";
import UserNavbar from "./variants/user/UserNavbar";
import AlphaNavbar from "./variants/alpha/AlphaNavbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { selectAllProfiles } from "@/store/profile/profile.selectors";
import { useAllNotifications } from "@/hooks/rtkQuery/queries/useNotifications";

//TODO:
// Get user data from context or global state
// UPDATE CORE and USER navbars to accept props

type NavbarProps = {
  usage: "core" | "user" | "guest" | 'alpha';
  user?: UserData;
  manualGoBack?: () => void;
};

const Navbar = ({ usage, user, manualGoBack }: NavbarProps) => {

  const account = useSelector((state: RootState) => state.account.data);
  const profiles = useSelector(selectAllProfiles);
  const profileIds = profiles?.map((profile) => profile.id) ?? [];
  const { data: notifications = [] } = useAllNotifications(profileIds);

  const count = notifications.filter((notification) => !notification.is_read).length;
  const label = account ? `${account.firstName}` : "Account";

  switch (usage) {
    case "core":
      return <CoreNavbar user={user} countNotifications={count} accountLabel={label} manualGoBack={manualGoBack} />;
    case "guest":
      return <GuestNavbar />;
    case "user":
      return <UserNavbar countNotifications={count} accountLabel={label} user={user} />;
    case "alpha":
      return <AlphaNavbar />;
    default:
      return <UserNavbar countNotifications={count} accountLabel={label} user={user} />;
  }
};

export default Navbar;
