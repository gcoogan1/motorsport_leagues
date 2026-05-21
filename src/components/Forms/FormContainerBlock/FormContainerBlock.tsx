import AddItem from '@/components/AddItem/AddItem'
import { ButtonContainer, Container, ContentContainer, Header, HeaderTitle } from './FormContainerBlock.styles'

type FormContainerBlockProps = {
  title: string;
  addItem: {
    label: string;
    onClick: () => void;
  };
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

const FormContainerBlock = ({ title, addItem, children, buttons }: FormContainerBlockProps) => {
  return (
    <Container>
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        <ButtonContainer>
          {buttons}
        </ButtonContainer>
      </Header>
      <ContentContainer>
        {children}
        <AddItem label={addItem.label} onClick={addItem.onClick} />
      </ContentContainer>
    </Container>
  )
}

export default FormContainerBlock