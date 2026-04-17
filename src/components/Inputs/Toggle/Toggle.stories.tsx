import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Toggle from "./Toggle";

// -- Meta Configuration -- //

const meta: Meta<typeof Toggle> = {
  title: "Components/Inputs/Toggle",
  decorators: [withAppTheme],
  component: Toggle,
  argTypes: {
    name: {
      control: "text",
    },
    label: {
      control: "text",
    },
    isOn: {
      control: "boolean",
    },
    defaultOn: {
      control: "boolean",
    },
    helperMessage: {
      control: "text",
    },
    disabled: {
      control: "boolean",
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
The **Toggle** component is an accessible boolean input with optional helper text.

### Features

- **Controlled or uncontrolled**: Supports both \`isOn\` + \`onChange\` and \`defaultOn\`.
- **Form-compatible**: Renders a hidden input when \`name\` is provided.
- **Keyboard accessible**: The switch supports keyboard toggling.
- **Helper text support**: Displays supporting text beneath the label.

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`name\` | \`string\` | Optional hidden input name for form submissions. |
| \`label\` | \`string\` | Label text shown next to the switch. |
| \`isOn\` | \`boolean\` | Controlled on/off state. |
| \`defaultOn\` | \`boolean\` | Initial on/off state for uncontrolled usage. |
| \`helperMessage\` | \`string\` | Optional helper text below the label. |
| \`disabled\` | \`boolean\` | Disables interaction when true. |
| \`onChange\` | \`(isOn: boolean) => void\` | Fired when the value changes. |
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Helper Controlled Component -- //

const ControlledToggleWrapper = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Toggle
        name="featureFlag"
        label="Enable feature"
        isOn={isOn}
        onChange={setIsOn}
        helperMessage="This setting is controlled externally."
      />
      <p style={{ fontSize: "12px", color: "#999" }}>
        Current state: {isOn ? "On" : "Off"}
      </p>
    </div>
  );
};

// -- Stories -- //

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    name: "notifications",
    label: "Enable notifications",
    defaultOn: false,
  },
};

export const On: Story = {
  args: {
    name: "notifications",
    label: "Enable notifications",
    defaultOn: true,
  },
};

export const WithHelperMessage: Story = {
  args: {
    name: "marketing",
    label: "Marketing updates",
    defaultOn: false,
    helperMessage: "Receive monthly product and event announcements.",
  },
};

export const Disabled: Story = {
  args: {
    name: "lockedSetting",
    label: "Locked setting",
    defaultOn: true,
    disabled: true,
    helperMessage: "This setting is managed by your league admin.",
  },
};

export const Controlled: Story = {
  render: () => <ControlledToggleWrapper />,
};
