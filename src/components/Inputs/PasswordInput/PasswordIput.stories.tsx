import type { Meta, StoryObj } from "@storybook/react";
import { useForm, FormProvider } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import PasswordInput from "./PasswordInput";

// -- Meta Configuration -- //

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Inputs/PasswordInput",
  decorators: [withAppTheme],
  component: PasswordInput,
  argTypes: {
    hasError: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    errorMessage: {
      control: "text",
    },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

// -- Helper RHF Wrapper -- //

const RHFWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: Record<string, any>;
}) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

// -- Stories -- //

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <PasswordInput {...args} />
    </RHFWrapper>
  ),
};
Default.args = {
  name: "name",
  label: "Label",
  placeholder: "Placeholder Text",
  helperText: "Helper Message.",
  hasError: false,
  errorMessage: "Error Message.",
};

export const WithError: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <PasswordInput {...args} />
    </RHFWrapper>
  ),
};
WithError.args = {
  name: "email",
  label: "Label",
  placeholder: "Placeholder Text",
  helperText: "Helper Message.",
  hasError: true,
  errorMessage: "Error Message.",
};


export const PopulatedValue: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "Passw0rd!" }}>
      <PasswordInput {...args} />
    </RHFWrapper>
  ),
};
PopulatedValue.args = {
  name: "team",
  label: "Label",
  placeholder: "Placeholder Text",
  helperText: "Helper Message.",
  hasError: false,
  errorMessage: "Error Message.",
};
