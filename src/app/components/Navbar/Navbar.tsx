
import type { UserData } from "@/types/auth.types";
import CoreNavbar from "./variants/core/CoreNavbar";
import GuestNavbar from "./variants/guest/GuestNavbar";
import UserNavbar from "./variants/user/UserNavbar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

//TODO:
// Get user data from context or global state
// UPDATE CORE and USER navbars to accept props

type NavbarProps = {
  usage: "core" | "user" | "guest";
  user?: UserData;
  manualGoBack?: () => void;
};

const Navbar = ({ usage, user, manualGoBack }: NavbarProps) => {

  const account = useSelector((state: RootState) => state.account.data);

  // Temporary hardcoded values for demonstration
  const count = user ? 0 : undefined;
  const label = account ? `${account.firstName}` : "Account";

  switch (usage) {
    case "core":
      return <CoreNavbar user={user} countNotifications={count} accountLabel={label} manualGoBack={manualGoBack} />;
    case "guest":
      return <GuestNavbar />;
    case "user":
      return <UserNavbar countNotifications={count} accountLabel={label} user={user} />;
    default:
      return <UserNavbar countNotifications={count} accountLabel={label} user={user} />;
  }
};

export default Navbar;
