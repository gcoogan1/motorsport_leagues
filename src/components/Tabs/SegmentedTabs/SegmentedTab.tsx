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
  shouldShrink?: boolean;
};

const SegmentedTab = ({ tabs, activeTab, onChange, fullWidth, shouldShrink }: SegmentedTabProps) => {

  return (
    <SwitchContainer fullWidth={fullWidth}>
      {tabs.map(({ label, shouldExpand }) => (
        <TabLink
          key={label}
          isSelected={label === activeTab}
          label={label}
          onClick={() => onChange(label)}
          shouldExpand={shouldExpand}
          shouldShrink={shouldShrink} 
        />
      ))}
    </SwitchContainer>
  );
};


export default SegmentedTab