import { useMediaQuery } from "@/hooks/useMediaQuery";
import ML_Icon from "@assets/Logos/MS/ML_Icon.svg?react";
import ML_Horizontal from "@assets/Logos/MS/ML_Horizontal.svg?react";
import { BrandWrapperLink } from "./NavBrand.styles";



const NavBrand = () => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  const LogoComponent = isMobile ? (
    <ML_Icon width={32} height={32} />
  ) : (
    <ML_Horizontal width={180} height={36} />
  );

  return (
    <BrandWrapperLink
      to="/"
      className={({ isActive }) => (isActive ? "active" : undefined)}
    >
      {LogoComponent}
    </BrandWrapperLink>
  );
};

export default NavBrand;
