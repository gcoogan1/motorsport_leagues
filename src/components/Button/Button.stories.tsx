import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Placeholder from "@assets/Icon/Placeholder.svg?react";
import Button from "./Button";

// -- Meta Configuration -- //

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  decorators: [withAppTheme],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: false,
    },
    icon: {
      control: false,
    },
    onClick: {
      action: "clicked",
    },
    size: {
      control: { type: "select" },
      options: ["small", "tall"],
    },
    variant: {
      control: { type: "select" },
    },
    color: {
      control: { type: "select" },
    },
    rounded: {
      control: { type: "boolean" },
    },
    iconOnly: {
      control: { type: "boolean" },
    },
    isLoading: {
      control: { type: "boolean" },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button Label",
  },
};


export const WithBothIcons: Story = {
  args: {
    children: "Button Label",
    icon: {
      left: <Placeholder />,
      right: <Placeholder />,
    },
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: "Button Label",
    icon: {
      left: <Placeholder />,
    },
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Button Label",
    icon: {
      right: <Placeholder />,
    },
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    icon: {
      left: <Placeholder />,
    },
  },
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Button variant="filled" onClick={() => console.log("Filled Clicked")}>
        Filled
      </Button>
      <Button variant="ghost" onClick={() => console.log("Ghost Clicked")}>
        Ghost
      </Button>
      <Button variant="outlined" onClick={() => console.log("Outline Clicked")}>
        Outline
      </Button>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <Button color="system" onClick={() => console.log("System Clicked")}>
        System
      </Button>
      <Button color="primary" onClick={() => console.log("Primary Clicked")}>
        Primary
      </Button>
      <Button color="danger" onClick={() => console.log("Danger Clicked")}>
        Danger
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Button size="small" onClick={() => console.log("Small Clicked")}>
        Small
      </Button>
      <Button size="tall" onClick={() => console.log("Tall Clicked")}>
        Tall
      </Button>
    </div>
  ),
};
