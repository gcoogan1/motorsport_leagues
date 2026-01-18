import styled from "styled-components";
import { usePanel } from "@/providers/panel/usePanel";
import { navigate } from "@/app/navigation/navigation";
import { designTokens } from "@/app/design/tokens";
import { topFadeBorder } from "@/app/design/mixens/edgeFadeBorder";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Profile from "@assets/Icon/Profile.svg?react";
import Button from "@/components/Button/Button";

const { layout, gradients, borders } = designTokens;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${layout.space.xSmall};
  padding-top: ${layout.space.medium};
  ${topFadeBorder({
    gradient: gradients.base.fadeOutHorizontal10,
    width: borders.width.thin,
  })}
`;

const GuestProfilesPanel = () => {

  const { closePanel } = usePanel();
  
  const handleGoToLogin = () => {
    closePanel();
    navigate('/login');
    return;
  }
  const handleGoToSignUp = () => {
    closePanel();
    navigate('/create-account');
    return;
  }
  
  return (
    <PanelLayout panelTitle="Profiles" panelTitleIcon={<Profile />}>
      <EmptyMessage
        title="Sign Up or Log In"
        icon={<Profile />}
        subtitle="Participate in Leagues with your driver Profiles and Squads. Get started now by creating an account."
      />
      <ActionsContainer>
        <Button color="system" onClick={handleGoToSignUp}>Create Account</Button>
        <Button color="system" variant="outlined" onClick={handleGoToLogin}>Log In</Button>
      </ActionsContainer>
    </PanelLayout>
  );
};

export default GuestProfilesPanel;
