import type { Meta, StoryObj } from "@storybook/react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Checkbox from "./Checkbox";

// -- Meta Configuration -- //

const meta: Meta<typeof Checkbox> = {
  title: "Components/Inputs/Checkbox",
  decorators: [withAppTheme],
  component: Checkbox,
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
The **Checkbox** component is an accessible boolean input that can be used in controlled or uncontrolled mode.

### Features

- **Controlled/Uncontrolled**: Supports both \`checked\` + \`onChange\` and \`defaultChecked\` usage
- **React Hook Form Integration**: Integrate via \`name\` prop and hidden input
- **Keyboard Accessible**: Full keyboard navigation and focus management
- **Visual Feedback**: Hover and active states with smooth transitions

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

// -- Helper Controlled Component -- //

const ControlledCheckboxWrapper = () => {
  const methods = useForm({
    defaultValues: { rememberMe: false },
  });
  const rememberMe = useWatch({
    control: methods.control,
    name: "rememberMe",
  });

  return (
    <FormProvider {...methods}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Checkbox
          name="rememberMe"
          label="Remember me on this device"
          checked={rememberMe}
          onChange={(checked) => methods.setValue("rememberMe", checked)}
        />
        <p style={{ fontSize: "12px", color: "#999" }}>
          Current state: {rememberMe ? "Checked" : "Unchecked"}
        </p>
      </div>
    </FormProvider>
  );
};

// -- Stories -- //

type Story = StoryObj<typeof Checkbox>;

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
    label: "Subscribe to Updates",
    defaultChecked: false,
    helperMessage: "We'll send you updates about new features and important announcements",
  },
};

export const CheckedWithHelperMessage: Story = {
  args: {
    name: "newsletter",
    label: "Subscribe to Updates",
    defaultChecked: true,
    helperMessage: "You'll receive weekly updates via email",
  },
};

export const Controlled: Story = {
  render: () => <ControlledCheckboxWrapper />,
};
