import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Profile from "@assets/Icon/Profile.svg?react";

const ProfilesPanel = () => {
  return (
    <PanelLayout 
      panelTitle="Profiles" 
      panelTitleIcon={<Profile />}
      >
      <EmptyMessage
        title="No Profiles Created"
        icon={<Profile />}
        subtitle="Start participating in Leagues by creating your first driver’s Profile."
      />
    </PanelLayout>
  );
};

export default ProfilesPanel;