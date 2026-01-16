import React from "react";
import NotificationIcon from "@assets/Icon/Notifications.svg?react";
import {
  CountBadge,
  CountText,
  NotificationWrapper,
} from "./NavNotification.styles";

type NavNotificationProps = {
  count?: number;
  onClick?: () => void;
};

const NavNotificationComponent = ({ count, onClick }: NavNotificationProps) => {
  
  return (
    <NotificationWrapper aria-label="Notifications" onClick={onClick}>
      {!!count && (
        <CountBadge aria-label={`${count} new notifications`}>
          <CountText>{count}</CountText>
        </CountBadge>
      )}
      <NotificationIcon />
    </NotificationWrapper>
  );
};

const NavNotification = React.memo(NavNotificationComponent);

export default NavNotification;