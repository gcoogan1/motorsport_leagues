import AccountPanel from "./variants/Account/AccountPanel";

type NavbarProps = {
  types: "account" | "profile" ;
};

const Panel = ({ types }: NavbarProps) => {

  switch (types) {
    case "account":
      return <AccountPanel />;
    default:
      return <AccountPanel/>;
  }
};

export default Panel;
