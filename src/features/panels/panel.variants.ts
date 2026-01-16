import AccountPanel from "./account/AccountPanel";
import NotificationPanel from "./notifications/NotificationPanel";

type PanelTypes = 'ACCOUNT' | 'NOTIFICATIONS';

export const panelVariants: Record<PanelTypes, React.FC> = {
  ACCOUNT: AccountPanel,
  NOTIFICATIONS: NotificationPanel,
};