import { navigate } from "@/app/navigation/navigation"
import Button from "@/components/Button/Button"
import ArrowFoward from "@assets/Icon/Arrow_Forward.svg?react"
import { ContentContainer, Description, PageWrapper, TextContainer, Title } from "./ErrorPage.styles"

const ErrorPage = () => {

  const handleGotoHomePage = () => {
    navigate("/")
  }
  return (
    <PageWrapper>
      <ContentContainer>
        <TextContainer>
          <Title>Hmm, Something Went Wrong</Title>
          <Description>Go back to the homepage and try again.</Description>
        </TextContainer>
        <Button
          color="system"
          variant="filled"
          icon={{ right: <ArrowFoward />}}
          onClick={handleGotoHomePage}
        >
          Go to Homepage
        </Button>
      </ContentContainer>
    </PageWrapper>
  )
}

export default ErrorPage