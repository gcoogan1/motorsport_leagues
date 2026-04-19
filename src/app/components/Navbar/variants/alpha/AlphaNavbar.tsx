import NavBrand from "../../components/NavBrand/NavBrand";
import NavLayout from "../../components/NavLayout/NavLayout";
import {
  LeftContainer,
} from "./AlphaNavbar.styles";

//TODO: Add onClick handlers to NavSelects and NavAccount

const AlphaNavbar = () => {

  return (
    <NavLayout>
      <LeftContainer>
        <NavBrand />
      </LeftContainer>
    </NavLayout>
  );
};

export default AlphaNavbar;
