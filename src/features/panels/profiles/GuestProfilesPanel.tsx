import { usePanel } from "@/providers/panel/usePanel";
import { navigate } from "@/app/navigation/navigation";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Profile from "@assets/Icon/Profile.svg?react";



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
        actions={{
          primary: {
            onClick: handleGoToSignUp,
            label: "Create Account",
          },
          secondary: {
            onClick: handleGoToLogin,
            label: "Log In",
          },
        }}
      />
    </PanelLayout>
  );
};

export default GuestProfilesPanel;
