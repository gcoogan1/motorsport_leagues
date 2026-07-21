import Loader from "@/components/Loader/Loader"
import { MessageContainer, TextContainer, Title } from "./LoadingMessage.styles"


const LoadingMessage = () => {
  return (
    <MessageContainer>
      <TextContainer>
        <Loader />
        <Title>Loading...</Title>
      </TextContainer>
    </MessageContainer>
  )
}

export default LoadingMessage