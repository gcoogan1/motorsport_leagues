import { navigate } from "@/app/navigation/navigation"
import Button from "@/components/Button/Button"
import ArrowFoward from "@assets/Icon/Arrow_Forward.svg?react"
import { ContentContainer, Description, PageWrapper, TextContainer, Title } from "./Unavailable.styles"

const Unavailable = () => {

  const handleGotoHomePage = () => {
    navigate("/")
  }
  return (
    <PageWrapper>
      <ContentContainer>
        <TextContainer>
          <Title>Uh-oh! Page Not Found</Title>
          <Description>Go back to the homepage and try again.</Description>
        </TextContainer>
        <Button
          color="system"
          variant="filled"
          icon={{ right: <ArrowFoward />}}
          onClick={handleGotoHomePage}
        >
          Go to HomePage
        </Button>
      </ContentContainer>
    </PageWrapper>
  )
}

export default Unavailable