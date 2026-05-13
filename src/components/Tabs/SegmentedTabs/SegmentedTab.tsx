import TabLink from "./components/TabLink/TabLink";
import { SwitchContainer } from "./SegmentedTab.styles";

type Tabs = {
  label: string;
  shouldExpand?: boolean;
}

type SegmentedTabProps = {
  tabs: Tabs[];
  activeTab: string;
  onChange: (tab: string) => void;
  fullWidth?: boolean;
};

const SegmentedTab = ({ tabs, activeTab, onChange, fullWidth }: SegmentedTabProps) => {

  return (
    <SwitchContainer fullWidth={fullWidth}>
      {tabs.map(({ label, shouldExpand }) => (
        <TabLink
          key={label}
          isSelected={label === activeTab}
          label={label}
          onClick={() => onChange(label)}
          shouldExpand={shouldExpand}
        />
      ))}
    </SwitchContainer>
  );
};


export default SegmentedTab