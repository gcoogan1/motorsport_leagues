import TabLink from "./TabLink/TabLink";
import { TabsContainer, TabsViewport } from "./Tabs.styles";

type TabLinkItem = {
  id: string
  label: string
}

type TabMenuProps = {
  tabs: TabLinkItem[],
  activeTab?: string,
  onTabChange?: (tabId: string) => void
};


const Tabs = ({ tabs, activeTab, onTabChange }: TabMenuProps) => {

  return (
    <TabsViewport>
      <TabsContainer>
        {tabs.map((tab) => (
          <TabLink key={tab.id} label={tab.label} active={tab.id === activeTab} onClick={() => onTabChange?.(tab.id)} />
        ))}
      </TabsContainer>
    </TabsViewport>
  )
}

export default Tabs;