import type { Meta, StoryObj } from "@storybook/react";
import Icon from "./Icon";
import Chat from "@assets/Icon/Chat.svg?react";

const meta: Meta<typeof Icon> = {
  title: "App/components/Icon",
  component: Icon,
  argTypes: {
    children: {
      control: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
### Icon Sizes

| Size    | Pixels |
|---------|--------|
| small   | 18px   |
| medium  | 20px   |
| large   | 24px   |
| xLarge  | 28px   |
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    size: "medium",
    children: <Chat />,
    ariaLabel: "Chat Icon",
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Icon size="small">
        <Chat />
      </Icon>
      <Icon size="medium">
        <Chat />
      </Icon>
      <Icon size="large">
        <Chat />
      </Icon>
      <Icon size="xLarge">
        <Chat />
      </Icon>
    </div>
  ),
};

// This story demonstrates the Icon component's ability to inherit color from its parent element as well as to have its color explicitly set via props.
// In this case, the first Chat icon inherits the blue color from the parent div, while the second Chat icon is explicitly set to red.
export const Colored: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, color: "#2563eb" }}>
      <Icon size="large">
        <Chat />
      </Icon>
      <Icon size="large">
        <Chat color="red" />
      </Icon>
    </div>
  ),
};
