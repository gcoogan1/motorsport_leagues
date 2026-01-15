
import type { UserData } from "@/types/auth.types";
import CoreNavbar from "./variants/core/CoreNavbar";
import GuestNavbar from "./variants/guest/GuestNavbar";
import UserNavbar from "./variants/user/UserNavbar";

//TODO:
// Get user data from context or global state
// UPDATE CORE and USER navbars to accept props

type NavbarProps = {
  usage: "core" | "user" | "guest";
  user?: UserData;
};

const Navbar = ({ usage, user }: NavbarProps) => {

  // Temporary hardcoded values for demonstration
  const count = user ? 3 : undefined;
  const label = user ? user.user_metadata?.first_name : "Account";

  switch (usage) {
    case "core":
      return <CoreNavbar user={user} countNotifications={count} accountLabel={label} />;
    case "guest":
      return <GuestNavbar />;
    case "user":
      return <UserNavbar countNotifications={count} accountLabel={label} user={user} />;
    default:
      return <UserNavbar countNotifications={count} accountLabel={label} user={user} />;
  }
};

export default Navbar;
