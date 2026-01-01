import AccountPanel from "./variants/account/AccountPanel";

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
