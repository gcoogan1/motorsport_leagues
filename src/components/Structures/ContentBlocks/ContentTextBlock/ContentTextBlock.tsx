import { TextContainer, Title, Message } from "./ContentTextBlock.styles";

type ContentTextBlockProps = {
  title: string;
  message: string;
};

const ContentTextBlock = ({ title, message }: ContentTextBlockProps) => {
  return (
    <TextContainer>
      <Title>{title}</Title>
      <Message>{message}</Message>
    </TextContainer>
  )
}

export default ContentTextBlock