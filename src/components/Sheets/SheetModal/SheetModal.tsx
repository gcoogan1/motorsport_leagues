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
  fullScreen?: boolean;
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
  fullScreen,
}: SheetModalProps) => {

  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <ModalOverlay>
      <ModalOverlayBackground $fullScreen={fullScreen}>
        <SheetContainer id={id} $fullScreen={fullScreen}>
          <SheetHeader>
            <TitleContainer>
              <Name>{seasonName}</Name>
              <Header>{header}</Header>
            </TitleContainer>
            {(blockHeader || blockDescription || headerChildren) && (
              <BlockContainer>
                <BlockHeaderContainer>
                  <BlockHeader>{blockHeader}</BlockHeader>
                  <BlockDescription>{blockDescription}</BlockDescription>
                </BlockHeaderContainer>
                {headerChildren && <BlockContents>{headerChildren}</BlockContents>}
              </BlockContainer>
            )}
            {filters && filters}
            <DetailsContainer>
              <DetailsTitle>{details?.title}</DetailsTitle>
              <DetailsContent>{details?.information}</DetailsContent>
            </DetailsContainer>
          </SheetHeader>
          <List $fullScreen={fullScreen}>{listChildren}</List>
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
              {!isMobile && "Close"}
            </Button>
          </ButtonContainer>
        </SheetContainer>
      </ModalOverlayBackground>
      </ModalOverlay>
  );
};

export default SheetModal;