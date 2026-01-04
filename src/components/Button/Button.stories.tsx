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
    docs: {
      description: {
        component: `
The **Button** component is a versatile and reusable UI element that allows users to perform actions with a single click. It supports various styles, sizes, and states to fit different design requirements.

### Features:

**Multiple variants:** filled, ghost, outlined

**Color options:** system, primary, danger

**Size options:** small, medium

**Icon support:** left, right, or both sides

**Loading state:** indicates ongoing processes

**Rounded corners:** optional rounded design

### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`children\` | \`React.ReactNode\` | \`-\` | The content of the button, typically text or icons. |
| \`icon\` | \`{ left?: React.ReactNode; right?: React.ReactNode; }\` | \`-\` | Icons to display on the left and/or right side of the button text. |
| \`onClick\` | \`() => void\` | \`-\` | Function to call when the button is clicked. |
| \`size\` | \`"small" | "medium"\` | \`"medium"\` | Defines the size of the button. |
| \`variant\` | \`"filled" | "ghost" | "outlined"\` | \`"filled"\` | Defines the visual style of the button. |
| \`color\` | \`"system" | "primary" | "danger"\` | \`"system"\` | Defines the color theme of the button. |
| \`rounded\` | \`boolean\` | \`false\` | If true, the button will have rounded corners. |
| \`isLoading\` | \`boolean\` | \`false\` | If true, the button will display a loading indicator. |
| \`type\` | \`"button" | "submit"\` | \`"button"\` | Specifies the button type attribute. |

### Usage Notes:
- The Button component can be easily customized using the provided props to fit various use cases.
- It is recommended to use the loading state when performing asynchronous actions to enhance user experience.

### Accessibility:
The Button component is designed with accessibility in mind, ensuring it is navigable via keyboard and screen readers.

        `,
      },
    },
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
      options: ["small", "medium"],
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
    isLoading: {
      control: { type: "boolean" },
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit"],
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
      <Button size="medium" onClick={() => console.log("Medium Clicked")}>
        Medium
      </Button>
    </div>
  ),
};
