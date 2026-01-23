import Button from "@/components/Button/Button";
import ArrowFoward from "@assets/Icon/Arrow_Forward.svg?react";
import {
  ContentContainer,
  Description,
  Main,
  PageWrapper,
  TextContainer,
  Title,
  Wrapper,
} from "./ErrorPage.styles";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";

// Error Page without Layout Component
// Used in AppErrorBoundary to avoid potential layout issues

const ErrorPageNoLayout = () => {

  // Manual navigation to homepage bc of error boundary context
  const gotoHomepage = () => {
    window.location.href = "/";
  };

  return (
    <Wrapper>
      <Navbar usage="core" manualGoBack={gotoHomepage} />
      <Main>
        <PageWrapper>
          <ContentContainer>
            <TextContainer>
              <Title>Hmm, Something Went Wrong</Title>
              <Description>Go back to the homepage and try again.</Description>
            </TextContainer>
            <Button
              color="system"
              variant="filled"
              icon={{ right: <ArrowFoward /> }}
              onClick={gotoHomepage}
            >
              Go to Homepage
            </Button>
          </ContentContainer>
        </PageWrapper>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default ErrorPageNoLayout;
