import CoreNavbar from "./variants/core/CoreNavbar";
import GuestNavbar from "./variants/guest/GuestNavbar";
import UserNavbar from "./variants/user/UserNavbar";

//TODO:
// Get user data from context or global state
// UPDATE CORE and USER navbars to accept props

type NavbarProps = {
  usage?: "core" | "user" | "guest";
};

const Navbar = ({ usage }: NavbarProps) => {

  // Temporary hardcoded values for demonstration
  const count = 3;
  const label = "Firstname";

  switch (usage) {
    case "core":
      return <CoreNavbar />;
    case "guest":
      return <GuestNavbar />;
    case "user":
    default:
      return <UserNavbar countNotifications={count} accountLabel={label} />;
  }
};

export default Navbar;
