import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import FormBlock from "./FormBlock";
import TextInput from "../../Inputs/TextInput/TextInput";
import PasswordInput from "../../Inputs/PasswordInput/PasswordInput";

// -- Meta Configuration -- //

const meta: Meta<typeof FormBlock> = {
  title: "Components/Forms/FormBlock",
  decorators: [withAppTheme],
  component: FormBlock,
  argTypes: {
    title: {
      control: "text",
    },
    question: {
      control: "text",
    },
    helperMessage: {
      control: "text",
    },
    onContinue: {
      action: "continued",
    },
    onCancel: {
      action: "cancelled",
    },
    children: {
      control: false,
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The FormBlock component is a reusable form container that provides a structured layout for forms, including a title, question, optional helper message, and action buttons for continuing or cancelling the form submission.

**Note:** Do not resize the FormBlock component. The width is managed by the parent container with a fixed width of 480px.

### Props

| Prop            | Type                     | Default       | Description                                                  |
|-----------------|--------------------------|---------------|--------------------------------------------------------------|
| \`title\`        | \`string\`                 | \`""\`          | The main title of the form block.                             |
| \`question\`     | \`string\`                 | \`""\`          | A question or prompt displayed below the title.               |
| \`helperMessage\` | \`string\`                 | \`""\`          | An optional helper message providing additional context.      |
| \`onContinue\`   | \`() => void\`            | \`() => {}\`   | Callback function invoked when the continue button is clicked.|
| \`onCancel\`     | \`() => void\`            | \`() => {}\`   | Callback function invoked when the cancel button is clicked.  |
| \`children\`     | \`React.ReactNode\`       | \`undefined\`  | The form elements to be rendered within the form block.       |

### Usage Notes

- The \`onContinue\` and \`onCancel\` props are essential for handling form submission and cancellation actions.
- The \`children\` prop should contain the input fields that need to be displayed within the FormBlock.
    `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof FormBlock>;

export const Default: Story = {
  args: {
    title: "Form Block Title",
    question: "Question",
    helperMessage: "Helper message.",
  },
  render: (args) => (
    <div style={{ width: "480px" }}>
      <FormBlock {...args}>
        <TextInput name="name" label="Label" placeholder="Placeholder Text" />
      </FormBlock>
    </div>
  ),
};

export const TwoInputs: Story = {
  args: {
    title: "Create Account",
    question: "Let’s get you set up",
    helperMessage: "You can change this later.",
  },
  render: (args) => (
    <div style={{ width: "480px" }}>
      <FormBlock {...args}>
        <TextInput name="username" label="Username" placeholder="Username" />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Password"
        />
      </FormBlock>
    </div>
  ),
};

export const ManyInputs: Story = {
  args: {
    title: "Profile Information",
    question: "Tell us about yourself",
    helperMessage: "This information will be displayed on your profile.",
  },
  render: (args) => (
    <div
      style={{
        width: "480px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <FormBlock {...args}>
        <TextInput
          name="firstName"
          label="First Name"
          placeholder="First Name"
        />
        <TextInput name="lastName" label="Last Name" placeholder="Last Name" />
        <TextInput
          name="email"
          label="Email Address"
          placeholder="Email Address"
        />
        <TextInput
          name="phone"
          label="Phone Number"
          placeholder="Phone Number"
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Password"
        />
      </FormBlock>
    </div>
  ),
};
