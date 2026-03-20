import { Text, Wrapper } from "./LoadingScreen.styles";

type LoadingScreenProps = {
  label?: string;
};

const LoadingScreen = ({ label = "Loading..." }: LoadingScreenProps) => {
  return (
    <Wrapper>
      <Text>{label}</Text>
    </Wrapper>
  );
};

export default LoadingScreen;
