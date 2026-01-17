import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import League from "@assets/Icon/League.svg?react";

const LeaguesPanel = () => {
  return (
    <PanelLayout 
      panelTitle="Leagues" 
      panelTitleIcon={<League />}
      >
      <EmptyMessage
        title="No Leagues Created or Joined"
        icon={<League />}
        subtitle="Use your driver Profile to join a League or use a Squad to create your perfect racing series."
      />
    </PanelLayout>
  );
};

export default LeaguesPanel;