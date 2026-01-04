import type { Meta, StoryObj } from "@storybook/react";
import { useForm, FormProvider } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Placeholder from "@assets/Icon/Placeholder.svg?react";
import TextInput from "./TextInput";

// -- Meta Configuration -- //

const meta: Meta<typeof TextInput> = {
  title: "Components/Inputs/TextInput",
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
    docs: {
      description: {
        component: `
The **TextInput** component is a versatile input field designed for capturing user text input. It includes features such as icons, character counters, and error handling to enhance user experience.

### Props

| Prop          | Type             | Default    | Description                                                  |
|---------------|------------------|------------|--------------------------------------------------------------|
| \`name\`        | \`string\`        | \`-\`       | The name of the input field, used for form handling.         |
| \`label\`       | \`string\`        | \`-\`       | The label displayed above the input field.                   |
| \`placeholder\` | \`string\`        | \`-\`       | Placeholder text displayed inside the input field.           |
| \`icon\`        | \`React.ReactNode\` | \`-\`       | An optional icon displayed within the input field.         |  
| \`showCounter\` | \`boolean\`       | \`false\`   | If true, displays a character counter above the input field. |
| \`maxLength\`   | \`number\`        | \`-\`       | The maximum number of characters allowed in the input field. |
| \`hasError\`    | \`boolean\`       | \`false\`   | Indicates whether the input field is in an error state.      |
| \`helperText\`  | \`string\`        | \`-\`       | Additional helper text displayed below the input field.      |
| \`errorMessage\`| \`string\`        | \`-\`       | The error message displayed when \`hasError\` is true.       |

### Usage Notes

- The TextInput component is integrated with React Hook Form for seamless form management.
- It is recommended to use the \`hasError\` and \`errorMessage\` props to provide feedback for invalid entries.
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
