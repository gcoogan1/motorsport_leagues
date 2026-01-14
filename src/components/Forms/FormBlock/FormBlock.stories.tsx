import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import FormBlock from "./FormBlock";
import TextInput from "../../Inputs/TextInput/TextInput";
import PasswordInput from "../../Inputs/PasswordInput/PasswordInput";
import { FormProviderMock } from "@/providers/mock/FormProviderMock";

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
    buttons: {
      onCancel: { control: false },
      onContinue: { control: false },
    },
    children: {
      control: false,
    },
    onSubmit: { control: false },
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
| \`buttons\`      | \`object\`                 | \`undefined\`  | Configuration for the continue and cancel buttons.           |
| \`buttons.onCancel\` | \`object\`             | \`undefined\`  | Configuration for the cancel button.                          |
| \`buttons.onContinue\` | \`object\`          | \`undefined\`  | Configuration for the continue button.                        |
| \`buttons.onCancel.label\` | \`string\`     | \`"Cancel"\`   | Label for the cancel button.                                  |
| \`buttons.onCancel.action\` | \`() => void\` | \`undefined\`  | Action to perform when the cancel button is clicked.          |
| \`buttons.onCancel.leftIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional left icon for the cancel button.                     |
| \`buttons.onCancel.loading\` | \`boolean\` | \`undefined\`  | Indicates if the cancel button is in a loading state.         |
| \`buttons.onCancel.loadingText\` | \`string\` | \`undefined\`  | Text to display when the cancel button is in a loading state. |
| \`buttons.onCancel.rightIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional right icon for the cancel button.                    |
| \`buttons.onContinue.label\` | \`string\`    | \`"Continue"\` | Label for the continue button.                                |
| \`buttons.onContinue.action\` | \`() => void\`| \`undefined\`  | Action to perform when the continue button is clicked.         |
| \`buttons.onContinue.leftIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional left icon for the continue button.                   |
| \`buttons.onContinue.rightIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional right icon for the continue button.                  |
| \`buttons.onContinue.loading\` | \`boolean\` | \`undefined\`  | Indicates if the continue button is in a loading state.         |
| \`buttons.onContinue.loadingText\` | \`string\` | \`undefined\`  | Text to display when the continue button is in a loading state. |
| \`children\`     | \`React.ReactNode\`       | \`undefined\`  | The form elements to be rendered within the form block.       |
| \`onSubmit\`     | \`(data: any) => void\`   | \`undefined\`  | Function to handle form submission.                           |

### Usage Notes

- The \`buttons\` prop allows customization of the labels, icons, and actions for both the continue and cancel buttons.
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
    buttons: {
      onContinue: {
        label: "Continue",
        action: () => alert("Continued"),
        rightIcon: <ArrowForward />,
      },
    },
  },
  render: (args) => (
    <FormProviderMock>
      <div style={{ width: "480px" }}>
        <FormBlock {...args}>
          <TextInput name="name" label="Label" placeholder="Placeholder Text" />
        </FormBlock>
      </div>
    </FormProviderMock>
  ),
};

export const TwoInputs: Story = {
  args: {
    title: "Create Account",
    question: "Let’s get you set up",
    helperMessage: "You can change this later.",
    buttons: {
      onContinue: {
        label: "Create Account",
        action: () => alert("Account Created"),
        rightIcon: <ArrowForward />,
      },
    },
  },
  render: (args) => (
    <FormProviderMock>
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
    </FormProviderMock>
  ),
};

export const ManyInputs: Story = {
  args: {
    title: "Profile Information",
    question: "Tell us about yourself",
    helperMessage: "This information will be displayed on your profile.",
    buttons: {
      onCancel: {
        label: "Back",
        action: () => alert("Going Back"),
        rightIcon: null,
      },
      onContinue: {
        label: "Save",
        action: () => alert("Profile Saved"),
        rightIcon: null,
      },
    },
  },
  render: (args) => (
    <FormProviderMock>
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
          <TextInput
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
          />
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
    </FormProviderMock>
  ),
};

export const WithButtons: Story = {
  args: {
    title: "Form Block with Buttons",
    question: "Do you want to proceed?",
    helperMessage: "You can cancel to go back.",
    buttons: {
      onCancel: {
        label: "Cancel",
        action: () => alert("Cancelled"),
        rightIcon: null,
      },
      onContinue: {
        label: "Create Account",
        action: () => alert("Created Account"),
        rightIcon: <ArrowForward />,
      },
    },
  },
  render: (args) => (
    <FormProviderMock>
      <div style={{ width: "480px" }}>
        <FormBlock {...args}>
          <TextInput
            name="input"
            label="Input"
            placeholder="Type something..."
          />
        </FormBlock>
      </div>
    </FormProviderMock>
  ),
};
