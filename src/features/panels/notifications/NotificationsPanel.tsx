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
        title="All Caught Up!"
        icon={<Notifications />}
        subtitle="You currently do not have any notifications."
      />
    </PanelLayout>
  );
};

export default NotificationsPanel;
