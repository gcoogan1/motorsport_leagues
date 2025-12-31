import type { Meta, StoryObj } from "@storybook/react";
import { useForm, FormProvider } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Placeholder from "@assets/Icon/Placeholder.svg?react";
import TextInput from "./TextInput";

// -- Meta Configuration -- //

const meta: Meta<typeof TextInput> = {
  title: "Components/TextInput",
  decorators: [withAppTheme],
  component: TextInput,
  argTypes: {
    icon: {
      control: false,
    },
    hasError: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    showCounter: {
      control: "boolean",
    },
    maxLength: {
      control: "number",
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

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <TextInput {...args} />
    </RHFWrapper>
  ),
};
Default.args = {
  name: "name",
  label: "Label",
  placeholder: "Placeholder Text",
  icon: <Placeholder />,
  helperText: "Helper Message.",
  hasError: false,
  errorMessage: "Error Message.",
};

export const WithError: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <TextInput {...args} />
    </RHFWrapper>
  ),
};
WithError.args = {
  name: "email",
  label: "Label",
  placeholder: "Placeholder Text",
  icon: <Placeholder />,
  helperText: "Helper Message.",
  hasError: true,
  errorMessage: "Error Message.",
};

export const WithCount: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <TextInput {...args} />
    </RHFWrapper>
  ),
};
WithCount.args = {
  name: "username",
  label: "Label",
  placeholder: "Placeholder Text",
  icon: <Placeholder />,
  helperText: "Helper Message.",
  showCounter: true,
  errorMessage: "Error Message.",
};

export const PopulatedValue: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "John Doe" }}>
      <TextInput {...args} />
    </RHFWrapper>
  ),
};
PopulatedValue.args = {
  name: "team",
  label: "Label",
  placeholder: "Placeholder Text",
  icon: <Placeholder />,
  helperText: "Helper Message.",
  hasError: false,
  errorMessage: "Error Message.",
};
