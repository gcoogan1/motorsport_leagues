import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import FormModal from "./FormModal";
import TextInput from "../../Inputs/TextInput/TextInput";
import PasswordInput from "../../Inputs/PasswordInput/PasswordInput";
import { withAppProviders } from "@/app/design/storybook/withAppProviders";
import { FormProviderMock } from "@/providers/mock/FormProviderMock";
import { Form } from "react-router";

// -- Meta Configuration -- //

const meta: Meta<typeof FormModal> = {
  title: "Components/Forms/FormModal",
  decorators: [withAppTheme, withAppProviders],
  component: FormModal,
  argTypes: {
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
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The FormModal component is a reusable form container that provides a structured layout for forms within a modal, including a question, optional helper message, and action buttons for continuing or cancelling the form submission.

**Note:** Clicking cancel/continue buttons will close it.

### Props

| Prop            | Type                     | Default       | Description                                                  |
|-----------------|--------------------------|---------------|--------------------------------------------------------------|
| \`question\`     | \`string\`                 | \`""\`          | A question or prompt displayed at the top of the modal.      |
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
| \`children\`     | \`React.ReactNode\`       | \`undefined\`  | The form elements to be rendered within the modal.           |

### Usage Notes

- The \`children\` prop should contain the input fields that need to be displayed within the FormModal.
    `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof FormModal>;

export const Default: Story = {
  args: {
    question: "Question",
    helperMessage: "Helper message.",
    buttons: {
      onContinue: {
        label: "Okay",
        action: () => alert("Form Submitted"),
        rightIcon: null,
      },
    },
  },
  render: (args) => (
    <FormProviderMock>
      <div style={{ width: "480px" }}>
        <FormModal {...args}>
          <TextInput name="name" label="Label" placeholder="Placeholder Text" />
        </FormModal>
      </div>
    </FormProviderMock>
  ),
};

export const TwoInputs: Story = {
  args: {
    question: "Let’s get you set up",
    helperMessage: "You can change this later.",
    buttons: {
      onContinue: {
        label: "Create Account",
        action: () => alert("Account Created"),
        rightIcon: null,
      },
    },
  },
  render: (args) => (
    <FormProviderMock>
      <div style={{ width: "480px" }}>
        <FormModal {...args}>
          <TextInput name="username" label="Username" placeholder="Username" />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Password"
          />
        </FormModal>
      </div>
    </FormProviderMock>
  ),
};

export const ManyInputs: Story = {
  args: {
    question: "Tell us about yourself",
    helperMessage: "This information will be displayed on your profile.",
    buttons: {
      onContinue: {
        label: "Submit",
        action: () => alert("Form Submitted"),
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
        <FormModal {...args}>
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
        </FormModal>
      </div>
    </FormProviderMock>
  ),
};
