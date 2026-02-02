import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import SelectGraphicInput from "./SelectGraphicInput";

// -- Meta Configuration -- //

const meta: Meta<typeof SelectGraphicInput> = {
  title: "Components/Inputs/SelectGraphicInput",
  component: SelectGraphicInput,
  decorators: [withAppTheme],
  argTypes: {
    label: {
      control: "text",
      description: "The label displayed above the avatar options",
    },
    helperText: {
      control: "text",
      description: "Additional helper text displayed below the avatar options",
    },
    defaultSelected: {
      control: "select",
      options: ["black", "blue", "green", "red", "yellow"],
      description: "The default selected avatar variant",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **SelectGraphicInput** component allows users to select an avatar from a predefined set of avatar options. It displays all available avatars and highlights the selected one.

### Features:

**Avatar selection:** Choose from multiple avatar variants.

**Visual feedback:** Selected avatar is highlighted.

**Pre-selection support:** Set a default selected avatar.

**Dynamic options:** Automatically displays all available avatars (excludes 'none' and 'email').

### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`label\` | \`string\` | \`""\` | The label displayed above the avatar options. |
| \`helperText\` | \`string\` | \`""\` | Additional helper text displayed below the avatar options. |
| \`defaultSelected\` | \`string\` | \`null\` | The variant key of the avatar to be selected by default. |

### Usage Notes:
- The component automatically filters out 'none' and 'email' avatar variants.
- Users can click on any avatar to select it.
- Only one avatar can be selected at a time.
- The selected state is managed internally (for now).
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof SelectGraphicInput>;

export const Default: Story = {
  args: {},
};

export const WithDefaultSelected: Story = {
  args: {
    defaultSelected: "blue",
  },
};