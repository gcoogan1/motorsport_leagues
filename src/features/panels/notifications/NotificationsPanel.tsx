import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Announcements from "@assets/Icon/Announcements.svg?react";

const NotificationsPanel = () => {
  return (
    <PanelLayout 
      panelTitle="Announcments" 
      panelTitleIcon={<Announcements />}
      >
      <EmptyMessage
        title="No Announcements"
        icon={<Announcements />}
        subtitle="You have no new announcements."
      />
    </PanelLayout>
  );
};

export default NotificationsPanel;
