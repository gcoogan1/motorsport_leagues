import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import AddItem from "./AddItem";

// -- Meta Configuration -- //

const meta: Meta<typeof AddItem> = {
  title: "Components/AddItem",
  decorators: [withAppTheme],
  component: AddItem,
  argTypes: {
    onClick: {
      action: "clicked",
      control: false,
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **AddItem** component renders a compact action row for adding a new item.

### Features

- **Action-first UI**: Presents a single clear add action.
- **Icon support**: Includes the add icon in the button.
- **Composable behavior**: Accepts an optional \`onClick\` handler for custom add flows.
- **Consistent styling**: Reuses the shared Button component and local wrapper styling.

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`onClick\` | \`() => void\` | Optional callback fired when the add button is clicked. |
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof AddItem>;

export const Default: Story = {
  args: {},
};

export const WithClickAction: Story = {
  args: {
    onClick: () => undefined,
  },
};
