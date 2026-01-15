import AccountPanel from "./account/AccountPanel";

type PanelTypes = 'ACCOUNT'; ;

export const panelVariants: Record<PanelTypes, React.FC> = {
  ACCOUNT: AccountPanel,
};