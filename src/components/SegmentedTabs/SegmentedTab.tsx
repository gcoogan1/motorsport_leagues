import TabLink from "./components/TabLink/TabLink";
import { SwitchContainer } from "./SegmentedTab.styles";

type SegmentedTabProps = {
  tabs: string[];
  activeTab: string;
  shouldExpand?: boolean;
  onChange: (tab: string) => void;
};

const SegmentedTab = ({ tabs, activeTab, shouldExpand, onChange }: SegmentedTabProps) => {

  return (
    <SwitchContainer>
      {tabs.map((label) => (
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