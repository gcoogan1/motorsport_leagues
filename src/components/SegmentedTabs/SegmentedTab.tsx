import TabLink from "./components/TabLink/TabLink";
import { SwitchContainer } from "./SegmentedTab.styles";

type Tabs = {
  label: string;
  isPrimary?: boolean;
}

type SegmentedTabProps = {
  tabs: Tabs[];
  activeTab: string;
  shouldExpand?: boolean;
  onChange: (tab: string) => void;
};

const SegmentedTab = ({ tabs, activeTab, shouldExpand, onChange }: SegmentedTabProps) => {

  return (
    <SwitchContainer>
      {tabs.map(({ label, isPrimary }) => (
        <TabLink
          key={label}
          isSelected={label === activeTab}
          label={label}
          onClick={() => onChange(label)}
          shouldExpand={shouldExpand}
          isPrimary={isPrimary}
        />
      ))}
    </SwitchContainer>
  );
};


export default SegmentedTab