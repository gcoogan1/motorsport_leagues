import { NavbarContainer, NavbarWrapper } from "./NavLayout.styles";


type NavLayoutProps = {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

const NavLayout = ({ children, ref }: NavLayoutProps) => {
  return (
    <NavbarWrapper ref={ref}>
      <NavbarContainer>
        {children}
      </NavbarContainer>
    </NavbarWrapper>
  )
}

export default NavLayout