
import MoreIcon from "@assets/Icon/More_Vertical.svg?react"
import {
  Container,
  Header,
  HeaderTitle,
  ContentContainer,
  MoreContainer,
} from './SubFormBlock.styles';
import Button from "@/components/Button/Button";

type SubFormBlockProps = {
  title: string;
  children?: React.ReactNode;
  moreOptions?: boolean;
  moreOnClick?: () => void;
  moreMenu?: React.ReactNode;
};

const SubFormBlock = ({
  title,
  children,
  moreOptions,
  moreOnClick,
  moreMenu,
}: SubFormBlockProps) => {
  return (
    <Container>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        {moreOptions && moreOnClick && (
          <MoreContainer>
            <Button color="base" variant="ghost" onClick={moreOnClick} icon={{ left: <MoreIcon /> }} />
            {moreMenu}
          </MoreContainer>
        )}
      </Header>
      <ContentContainer>
        {children}
      </ContentContainer>
    </Container>
  );
};

export default SubFormBlock;