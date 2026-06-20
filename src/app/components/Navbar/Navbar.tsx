
import type { UserData } from "@/types/auth.types";
import CoreNavbar from "./variants/core/CoreNavbar";
import GuestNavbar from "./variants/guest/GuestNavbar";
import AlphaNavbar from "./variants/alpha/AlphaNavbar";
import NewNavbar from "./variants/new/NewNavbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { selectAllProfiles } from "@/store/profile/profile.selectors";
import { useAllNotifications } from "@/rtkQuery/hooks/queries/useNotifications";

//TODO:
// Get user data from context or global state
// UPDATE CORE and USER navbars to accept props

type NavbarProps = {
  usage: "core" | "user" | "guest" | "alpha" | "new";
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
      return <NewNavbar countNotifications={count} accountLabel={label} user={user} />;
    case "new":
      return <NewNavbar countNotifications={count} accountLabel={label} user={user} />;
    case "alpha":
      return <AlphaNavbar />;
    default:
      return <NewNavbar countNotifications={count} accountLabel={label} user={user} />;
  }
};

export default Navbar;
