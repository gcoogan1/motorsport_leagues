import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ToastLayout from "./ToastLayout";

// -- Meta Configuration -- //

const meta: Meta<typeof ToastLayout> = {
  title: "Components/Messages/components/ToastLayout/ToastLayout",
  component: ToastLayout,
  decorators: [withAppTheme],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `

The **ToastLayout** component is used to display brief, informative messages to users. It appears at the bottom right of the screen.

**Note:** Closing functionality is not implemented in this version, nor is automatic dismissal after a duration.

## Props

| Prop        | Type                     | Default       | Description                                                  |
|-------------|--------------------------|---------------|--------------------------------------------------------------|
| \`usage\`   | \`"success" | "error" | "info"\` | \`"info"\`     | Defines the style and icon of the toast message.    |
| \`message\` | \`string\`               | \`""\`        | The message text to be displayed in the toast.               |

## Features

Supports three usage types: **success**, **error**, and **info**.

Automatically styled based on the usage type.

Includes an icon corresponding to the usage type.

Positioned at the bottom right of the screen for visibility.

## Usage Notes

- The toast will automatically disappear after a set duration (not implemented in this version).

        `,
      },
    },
  },
  argTypes: {
    usage: {
      control: "select",
      options: ["success", "error", "info"],
    },
    message: {
      control: "text",
    },
    onClose: { action: "closed" },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof ToastLayout>;

export const SuccessToast: Story = {
  args: {
    usage: "success",
    message: "This is a success message.",
  },
};

export const ErrorToast: Story = {
  args: {
    usage: "error",
    message: "This is an error message.",
  },
};

export const InfoToast: Story = {
  args: {
    usage: "info",
    message: "This is an informational message.",
  },
};
