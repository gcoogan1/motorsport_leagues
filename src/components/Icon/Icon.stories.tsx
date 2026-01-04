import type { Meta, StoryObj } from "@storybook/react";
import Icon from "./Icon";
import Chat from "@assets/Icon/Chat.svg?react";

// -- Meta Configuration -- //

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
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
The **Icon** component is used to display SVG icons within the application. It supports various sizes and can inherit color from its parent element or have its color explicitly set via props.

### Props

| Prop       | Type                          | Default    | Description                                                  |
|------------|-------------------------------|------------|--------------------------------------------------------------|
| \`size\`     | \`"small" | "medium" | "large" | "xLarge"\` | \`"medium"\` | Defines the size of the icon.                                |
| \`color\`    | \`string\`                     | \`undefined\` | Sets the color of the icon. If not provided, the icon inherits color from its parent element. |
| \`children\` | \`React.ReactNode\`            | \`-\`       | The SVG icon to be displayed.                                |

### Icon Sizes

| Size    | Pixels |
|---------|--------|
| small   | 18px   |
| medium  | 20px   |
| large   | 24px   |
| xLarge  | 28px   |

### Usage Notes

- The Icon component is designed to be flexible and easily integrated into various parts of the application.
- It is recommended to use the predefined sizes for consistency across the UI.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

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
