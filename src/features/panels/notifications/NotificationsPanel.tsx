import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import Notifications from "@assets/Icon/Notifications.svg?react";

const NotificationsPanel = () => {
  return (
    <PanelLayout 
      panelTitle="Notifications" 
      panelTitleIcon={<Notifications />}
      >
      <EmptyMessage
        title="No Notifications"
        icon={<Notifications />}
        subtitle="You have no new notifications."
      />
    </PanelLayout>
  );
};

export default NotificationsPanel;
