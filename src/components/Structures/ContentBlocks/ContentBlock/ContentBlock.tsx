import { Container, ImageContainer } from "./ContentBlock.styles";
import ContentTextBlock from "../ContentTextBlock/ContentTextBlock";

type ContentTextBlockProps = {
  title: string;
  message: string;
  imageUrl: string;
  isFlipped?: boolean;
};

const ContentBlock = ({ title, message, imageUrl, isFlipped }: ContentTextBlockProps) => {
  return (
    <Container isFlipped={isFlipped}>
      <ContentTextBlock title={title} message={message} />
      <ImageContainer src={imageUrl} alt={title} isFlipped={isFlipped} />
    </Container>
  )
}

export default ContentBlock