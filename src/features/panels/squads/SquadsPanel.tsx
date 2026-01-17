import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Squad from "@assets/Icon/Squad.svg?react";

const SquadsPanel = () => {
  return (
    <PanelLayout 
      panelTitle="Squads" 
      panelTitleIcon={<Squad />}
      >
      <EmptyMessage
        title="No Squads Created or Joined"
        icon={<Squad />}
        subtitle="Start building your racing community by creating or joining your first Squad with a Profile."
      />
    </PanelLayout>
  );
};

export default SquadsPanel;