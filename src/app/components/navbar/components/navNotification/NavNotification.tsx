import React from "react";
import NotificationIcon from "@assets/Icon/Notifications.svg?react";
import {
  CountBadge,
  CountText,
  NotificationWrapper,
} from "./NavNotification.styles";

type NavNotificationProps = {
  count?: number;
};

const NavNotificationComponent = ({ count }: NavNotificationProps) => {
  return (
    <NotificationWrapper aria-label="Notifications">
      {!!count && count > 0 && (
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