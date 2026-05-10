import Button from "@/components/Button/Button";
import CloseIcon from "@assets/Icon/Close.svg?react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  BlockContainer,
  BlockContents,
  BlockDescription,
  BlockHeader,
  BlockHeaderContainer,
  ButtonContainer,
  DetailsContainer,
  DetailsContent,
  DetailsTitle,
  ModalOverlay,
  SheetContainer,
  SheetHeader,
  List,
  Header,
  Name,
  TitleContainer,
  ModalOverlayBackground,
} from "./SheetModal.styles";

type SheetModalProps = {
  id: string;
  seasonName: string;
  header: string;
  blockHeader?: string;
  blockDescription?: string;
  headerChildren?: React.ReactNode;
  filters?: React.ReactNode;
  details?: {
    title: string;
    information: string;
  };
  listChildren: React.ReactNode;
  onClose: () => void;
};

const SheetModal = ({
  id,
  seasonName,
  header,
  blockHeader,
  blockDescription,
  headerChildren,
  filters,
  details,
  listChildren,
  onClose,
}: SheetModalProps) => {

  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <ModalOverlay>
      <ModalOverlayBackground>
        <SheetContainer id={id}>
          <SheetHeader>
            <TitleContainer>
              <Name>{seasonName}</Name>
              <Header>{header}</Header>
            </TitleContainer>
            <BlockContainer>
              <BlockHeaderContainer>
                <BlockHeader>{blockHeader}</BlockHeader>
                <BlockDescription>{blockDescription}</BlockDescription>
              </BlockHeaderContainer>
              {headerChildren && <BlockContents>{headerChildren}</BlockContents>}
            </BlockContainer>
            {filters && filters}
            <DetailsContainer>
              <DetailsTitle>{details?.title}</DetailsTitle>
              <DetailsContent>{details?.information}</DetailsContent>
            </DetailsContainer>
          </SheetHeader>
          <List>{listChildren}</List>
          <ButtonContainer>
            <Button
              onClick={onClose}
              size={"medium"}
              color="base"
              variant="filled"
              rounded
              icon={{
                left: <CloseIcon />
              }}
            >
              {isMobile && "Close"}
            </Button>
          </ButtonContainer>
        </SheetContainer>
      </ModalOverlayBackground>
      </ModalOverlay>
  );
};

export default SheetModal;