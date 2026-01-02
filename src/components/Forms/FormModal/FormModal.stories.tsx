import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import FormModal from "./FormModal";
import TextInput from "../../Inputs/TextInput/TextInput";
import PasswordInput from "../../Inputs/PasswordInput/PasswordInput";

// -- Meta Configuration -- //

const meta: Meta<typeof FormModal> = {
  title: "Components/Forms/FormModal",
  decorators: [withAppTheme],
  component: FormModal,
  argTypes: {
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
The FormModal component is a reusable form container that provides a structured layout for forms within a modal, including a question, optional helper message, and action buttons for continuing or cancelling the form submission.

Note: Clicking outside the modal or on the cancel/continue buttons will close it.
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
  },
  render: (args) => (
    <div style={{ width: "480px" }}>
      <FormModal {...args}>
        <TextInput name="name" label="Label" placeholder="Placeholder Text" />
      </FormModal>
    </div>
  ),
};

export const TwoInputs: Story = {
  args: {
    question: "Let’s get you set up",
    helperMessage: "You can change this later.",
  },
  render: (args) => (
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
  ),
};

export const ManyInputs: Story = {
  args: {
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
      <FormModal {...args}>
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
      </FormModal>
    </div>
  ),
};
