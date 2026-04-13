import type { Meta, StoryObj } from "@storybook/react";
import { useForm, FormProvider } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import TextAreaInput from "./TextAreaInput";

// -- Meta Configuration -- //

const meta: Meta<typeof TextAreaInput> = {
  title: "Components/Inputs/TextAreaInput",
  decorators: [withAppTheme],
  component: TextAreaInput,
  argTypes: {
    name: {
      control: "text",
    },
    label: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    rows: {
      control: "number",
    },
    maxLength: {
      control: "number",
    },
    showCounter: {
      control: "boolean",
    },
    helperText: {
      control: "text",
    },
    hasError: {
      control: "boolean",
    },
    errorMessage: {
      control: "text",
    },
    autoComplete: {
      control: "text",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **TextAreaInput** component is a multiline text input integrated with React Hook Form.

### Features

- Multiline entry with configurable rows
- Optional character counter
- Helper and error messaging

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`name\` | \`string\` | \`-\` | Field name used by React Hook Form. |
| \`label\` | \`string\` | \`-\` | Label shown above the textarea. |
| \`placeholder\` | \`string\` | \`-\` | Placeholder text. |
| \`rows\` | \`number\` | \`5\` | Number of visible text rows. |
| \`maxLength\` | \`number\` | \`1000\` | Maximum allowed characters. |
| \`showCounter\` | \`boolean\` | \`false\` | Shows character counter when enabled. |
| \`helperText\` | \`string\` | \`-\` | Helper text below the input. |
| \`hasError\` | \`boolean\` | \`false\` | Error state flag. |
| \`errorMessage\` | \`string\` | \`-\` | Error message when \`hasError\` is true. |
        `,
      },
    },
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

type Story = StoryObj<typeof TextAreaInput>;

export const Default: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <TextAreaInput {...args} />
    </RHFWrapper>
  ),
};
Default.args = {
  name: "description",
  label: "Description",
  placeholder: "Add details...",
  rows: 4,
  maxLength: 280,
  helperText: "Keep this short and clear.",
  hasError: false,
  errorMessage: "",
};

export const WithCounter: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <TextAreaInput {...args} />
    </RHFWrapper>
  ),
};
WithCounter.args = {
  name: "description",
  label: "Description",
  placeholder: "Add details...",
  rows: 4,
  maxLength: 280,
  showCounter: true,
  helperText: "Keep this short and clear.",
};

export const WithError: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <TextAreaInput {...args} />
    </RHFWrapper>
  ),
};
WithError.args = {
  name: "description",
  label: "Description",
  placeholder: "Add details...",
  rows: 4,
  maxLength: 280,
  helperText: "Keep this short and clear.",
  hasError: true,
  errorMessage: "Description is required.",
};

export const PopulatedValue: Story = {
  render: (args) => (
    <RHFWrapper
      defaultValues={{
        [args.name]: "This league runs weekly races with stewarded sessions.",
      }}
    >
      <TextAreaInput {...args} />
    </RHFWrapper>
  ),
};
PopulatedValue.args = {
  name: "description",
  label: "Description",
  placeholder: "Add details...",
  rows: 4,
  maxLength: 280,
  showCounter: true,
  helperText: "Keep this short and clear.",
};
