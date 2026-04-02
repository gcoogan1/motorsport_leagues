import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import CheckboxItem from "./CheckboxItem";

// -- Meta Configuration -- //

const meta: Meta<typeof CheckboxItem> = {
  title: "Components/Inputs/CheckboxItem",
  decorators: [withAppTheme],
  component: CheckboxItem,
  argTypes: {
    name: {
      control: "text",
    },
    label: {
      control: "text",
    },
    checked: {
      control: "boolean",
    },
    defaultChecked: {
      control: "boolean",
    },
    helperMessage: {
      control: "text",
    },
    onChange: {
      action: "changed",
      control: false,
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **CheckboxItem** component wraps the base Checkbox in a larger selectable container.

### Features

- **Selectable card UI**: Renders a bordered container around the checkbox content
- **Controlled or uncontrolled**: Supports both \`checked\` + \`onChange\` and \`defaultChecked\` usage
- **Helper text support**: Displays additional supporting copy under the label
- **Visual selected state**: Applies a stronger selected treatment when checked

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`name\` | \`string\` | Optional hidden input name for form submissions |
| \`label\` | \`string\` | Label text displayed next to the checkbox |
| \`checked\` | \`boolean\` | Controlled checked state |
| \`defaultChecked\` | \`boolean\` | Initial checked state for uncontrolled usage |
| \`helperMessage\` | \`string\` | Optional helper text displayed below the label |
| \`onChange\` | \`(checked: boolean) => void\` | Fired when checkbox is toggled |
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof CheckboxItem>;

export const Default: Story = {
  args: {
    name: "acceptTerms",
    label: "Accept Terms and Conditions",
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    name: "acceptTerms",
    label: "Accept Terms and Conditions",
    defaultChecked: true,
  },
};

export const WithHelperMessage: Story = {
  args: {
    name: "newsletter",
    label: "Subscribe to email updates",
    defaultChecked: false,
    helperMessage: "Receive product announcements and important account updates.",
  },
};

export const CheckedWithHelperMessage: Story = {
  args: {
    name: "marketing",
    label: "Allow marketing emails",
    defaultChecked: true,
    helperMessage: "You can opt out at any time from your account settings.",
  },
};
