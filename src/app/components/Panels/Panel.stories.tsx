import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import  Panel from "./Panel";

// -- Meta Configuration -- //

const Meta: Meta<typeof Panel> = {
  title: "App/Components/Panels",
  component: Panel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`Panel\` component is a versatile container used to display various types of content in a structured format. It supports different panel types to cater to specific use cases.

### Props

| Prop    | Type                     | Default       | Description                                                  |
|---------|--------------------------|---------------|--------------------------------------------------------------|
| \`types\` | \`"account" | "profile"\` | \`"account"\` | Specifies the type of panel to render, affecting its layout and content. |

### Usage Notes

- The \`types\` prop allows for easy switching between different panel styles.
- Ensure that the content provided within the panel aligns with the selected type for optimal user experience.
        `,
      },
    },
  },
  decorators: [withAppTheme],
  tags: ["autodocs"],
  argTypes: {
    types: {
      control: { type: "select", options: ["account", "profile"] },
    },
  },
};

export default Meta;

// -- Stories -- //

type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: (args) => <div><Panel {...args} /></div>,
  args: {
    types: "account",
  },
};