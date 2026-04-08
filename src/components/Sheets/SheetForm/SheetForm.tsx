import Button from "@/components/Button/Button";
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
  FormContainer,
  FormHeader,
  FormList,
  Header,
  Name,
  TitleContainer,
} from "./SheetForm.styles";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type SheetFormProps = {
  id: string;
  seasonName: string;
  header: string;
  blockHeader?: string;
  blockDescription?: string;
  headerChildren?: React.ReactNode;
  tabs?: React.ReactNode;
  filters?: React.ReactNode;
  details?: {
    title: string;
    information: string;
  };
  listChildren: React.ReactNode;
  onSave: () => void;
};

const SheetForm = ({
  id,
  seasonName,
  header,
  blockHeader,
  blockDescription,
  headerChildren,
  tabs,
  filters,
  details,
  listChildren,
  onSave,
}: SheetFormProps) => {

  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <FormContainer id={id} role="tabpanel" aria-labelledby={`${id}-tab`}>
      <FormHeader>
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
        {tabs && tabs}
        {filters && filters}
        <DetailsContainer>
          <DetailsTitle>{details?.title}</DetailsTitle>
          <DetailsContent>{details?.information}</DetailsContent>
        </DetailsContainer>
      </FormHeader>
      <FormList>{listChildren}</FormList>
      <ButtonContainer>
        <Button
          onClick={onSave}
          size={isMobile ? "small" : "medium"}
          color="primary"
          variant="filled"
          rounded
        >
          Save Changes
        </Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default SheetForm;
