import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import PanelHeader from "./PanelHeader";
import Placeholder from "@assets/Icon/Placeholder.svg?react";

// -- Meta Configuration -- //

const Meta: Meta<typeof PanelHeader> = {
  title: "App/Components/Panels/components/PanelHeader",
  component: PanelHeader,
  parameters: {
    layout: "centered",
  },
  decorators: [withAppTheme],
  tags: ["autodocs"],
  argTypes: {
    panelTitle: {
      control: { type: "text" },
    },
    panelTitleIcon: {
      control: false,
    },
    showShadow: {
      control: { type: "boolean" },
    },
    onClose: {
      action: "closed",
    },
  },
};

export default Meta;

// -- Stories -- //

type Story = StoryObj<typeof PanelHeader>;

export const Default: Story = {
  args: {
    panelTitle: "Panel Title",
    panelTitleIcon: <Placeholder />,
    showShadow: true,
    onClose: () => alert("Panel closed"),
  },
};