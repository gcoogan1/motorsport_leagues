import { usePanel } from "@/providers/panel/PanelProvider";
import PanelHeader from "../PanelHeader/PanelHeader";
import {
  PanelActionsContainer,
  PanelBody,
  PanelTabs,
  PanelWrapper,
  PrimaryButtonContainer,
} from "./PanelLayout.styles";
import Button from "@/components/Button/Button";
import SegmentedTab from "@/components/SegmentedTabs/SegmentedTab";
import { useState } from "react";

type PanelLayoutProps = {
  children?: React.ReactNode;
  panelTitle?: string;
  panelTitleIcon?: React.ReactNode;
  actions?: {
    primary?: {
      label: string;
      action?: () => void;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
    secondary?: {
      label: string;
      action?: () => void;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
  };
  tabs?: string[];
};

const PanelLayout = ({
  children,
  panelTitle,
  panelTitleIcon,
  actions,
  tabs,
}: PanelLayoutProps) => {
  const { closePanel } = usePanel();
  const [activeTab, setActiveTab] = useState<string>(tabs ? tabs[0] : "");

  return (
    <PanelWrapper>
      <PanelHeader
        panelTitle={panelTitle}
        panelTitleIcon={panelTitleIcon}
        onClose={closePanel}
      />
      {tabs && (
        <PanelTabs>
          <SegmentedTab
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            shouldExpand
          />
        </PanelTabs>
      )}
      <PanelBody>{children}</PanelBody>
      {actions && (
        <PanelActionsContainer>
          {actions.primary && (
            <PrimaryButtonContainer>
              <Button
                color="base"
                fullWidth
                variant="filled"
                onClick={actions.primary.action}
                isLoading={actions.primary.loading}
                loadingText={actions.primary.loadingText}
                icon={{
                  left: actions.primary.leftIcon,
                  right: actions.primary.rightIcon,
                }}
              >
                {actions.primary.label}
              </Button>
            </PrimaryButtonContainer>
          )}
          {actions.secondary && (
            <Button
              color="base"
              variant="outlined"
              onClick={actions.secondary.action}
              isLoading={actions.secondary.loading}
              loadingText={actions.secondary.loadingText}
              icon={{
                left: actions.secondary.leftIcon,
                right: actions.secondary.rightIcon,
              }}
            >
              {actions.secondary.label}
            </Button>
          )}
        </PanelActionsContainer>
      )}
    </PanelWrapper>
  );
};

export default PanelLayout;
