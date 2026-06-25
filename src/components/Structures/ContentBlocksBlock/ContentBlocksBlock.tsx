import { Container, ContentDescription, ContentTextContainer, ContentTitle, ImageContainer } from "./ContentBlocksBlock.styles";

type ContentBlocksBlockProps = {
  isFlipped?: boolean;
  title: string;
  description?: string;
  imageSrc?: string;
};

const ContentBlocksBlock = ({ isFlipped, title, description, imageSrc }: ContentBlocksBlockProps) => {
  return (
    <Container $isFlipped={isFlipped}>
      <ImageContainer $imageSrc={imageSrc} $isFlipped={isFlipped} />
      <ContentTextContainer>
        <ContentTitle>{title}</ContentTitle>
        {description && <ContentDescription>{description}</ContentDescription>}
      </ContentTextContainer>
    </Container>
  )
}

export default ContentBlocksBlock