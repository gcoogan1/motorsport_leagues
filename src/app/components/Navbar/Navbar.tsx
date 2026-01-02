import CoreNavbar from "./variants/core/CoreNavbar";
import GuestNavbar from "./variants/guest/GuestNavbar";
import UserNavbar from "./variants/user/UserNavbar";

type NavbarProps = {
  usage?: "core" | "user" | "guest";
};

const Navbar = ({ usage }: NavbarProps) => {
  const count = 3;
  const label = "Firstname";

  switch (usage) {
    case "core":
      return <CoreNavbar countNotifications={count} accountLabel={label} />;
    case "guest":
      return <GuestNavbar />;
    case "user":
    default:
      return <UserNavbar countNotifications={count} accountLabel={label} />;
  }
};

export default Navbar;
