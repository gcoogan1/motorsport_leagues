import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import SelectGraphicInput from "./SelectGraphicInput";

// -- Meta Configuration -- //

const meta: Meta<typeof SelectGraphicInput> = {
  title: "Components/Inputs/SelectGraphicInput",
  component: SelectGraphicInput,
  decorators: [withAppTheme],
  argTypes: {
    name: {
      control: false,
      description: "The name of the form field",
    },
    label: {
      control: "text",
      description: "The label displayed above the avatar options",
    },
    helperText: {
      control: "text",
      description: "Additional helper text displayed below the avatar options",
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

**Dynamic options:** Automatically displays all available avatars (excludes 'none' and 'email').

### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`name\` | \`"avatar"\` | \`-\` | The name of the form field. |
| \`label\` | \`string\` | \`""\` | The label displayed above the avatar options. |
| \`helperText\` | \`string\` | \`""\` | Additional helper text displayed below the avatar options. |

### Usage Notes:
- The component automatically filters out 'none' and 'email' avatar variants.
- Users can click on any avatar to select it.
- Only one avatar can be selected at a time.
- The selected state is managed in parent form using React Hook Form.
- Default selection can be set via form's default values.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof SelectGraphicInput>;

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      avatar: { type: "preset" as const, variant: "black" as const },
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export const Default: Story = {
  args: {
    name: "avatar",
    label: "Select an Avatar",
    helperText: "Choose one of the avatars above.",
  },
  render: (args) => (
    <FormWrapper>
      <SelectGraphicInput {...args} />
    </FormWrapper>
  ),
};

export const WithDifferentLabel: Story = {
  args: {
    name: "avatar",
    label: "Pick Your Character",
    helperText: "Select your favorite avatar style.",
  },
  render: (args) => (
    <FormWrapper>
      <SelectGraphicInput {...args} />
    </FormWrapper>
  ),
};

export const NoHelperText: Story = {
  args: {
    name: "avatar",
    label: "Choose Avatar",
  },
  render: (args) => (
    <FormWrapper>
      <SelectGraphicInput {...args} />
    </FormWrapper>
  ),
};