import type { Meta, StoryObj } from "@storybook/react";
import { useForm, FormProvider } from "react-hook-form";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import SearchInput from "./SearchInput";

// -- Meta Configuration -- //

const meta: Meta<typeof SearchInput> = {
  title: "Components/Inputs/SearchInput",
  decorators: [withAppTheme],
  component: SearchInput,
  argTypes: {
    name: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **SearchInput** component is a specialized input field designed for search functionality. It includes a search icon and a clear button that appears when the user has entered text.

### Features

- **Search Icon**: Displays a search icon on the right side of the input
- **Clear Button**: Shows a close icon button when input has value
- **React Hook Form Integration**: Seamlessly integrates with form state management

### Props

| Prop          | Type      | Default | Description                                               |
|---------------|-----------|---------|-----------------------------------------------------------|
| \`name\`        | \`string\`  | \`-\`    | The name of the input field, used for form handling.      |
| \`placeholder\` | \`string\`  | \`-\`    | Placeholder text displayed inside the search field.       |

### Usage Notes

- The SearchInput component must be wrapped in a React Hook Form FormProvider
- The clear button automatically appears when the user enters text
- Clicking the clear button resets the input value
- The search icon is always visible on the right side

### Accessibility

- The clear button is keyboard accessible
- The input field follows standard form input accessibility patterns
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

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <SearchInput {...args} />
    </RHFWrapper>
  ),
};
Default.args = {
  name: "search",
  placeholder: "Search...",
};

export const WithValue: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "Gran Turismo 7" }}>
      <SearchInput {...args} />
    </RHFWrapper>
  ),
};
WithValue.args = {
  name: "search",
  placeholder: "Search...",
};

export const CustomPlaceholder: Story = {
  render: (args) => (
    <RHFWrapper defaultValues={{ [args.name]: "" }}>
      <SearchInput {...args} />
    </RHFWrapper>
  ),
};
CustomPlaceholder.args = {
  name: "search",
  placeholder: "Search for profiles, leagues, or squads...",
};
