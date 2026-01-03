import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Toast from "./Toast";

// -- Meta Configuration -- //

const meta: Meta<typeof Toast> = {
  title: "Components/Messages/Toast",
  component: Toast,
  decorators: [withAppTheme],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `

The **Toast** component is used to display brief, informative messages to users. It appears at the bottom right of the screen.

## Props

| Prop        | Type                     | Default       | Description                                                  |
|-------------|--------------------------|---------------|--------------------------------------------------------------|
| \`usage\`   | \`"success" | "error" | "info"\` | \`"info"\`     | Defines the style and icon of the toast message.    |
| \`message\` | \`string\`               | \`""\`        | The message text to be displayed in the toast.               |

## Features

- Supports three usage types: **success**, **error**, and **info**.
- Automatically styled based on the usage type.
- Includes an icon corresponding to the usage type.  
- Positioned at the bottom right of the screen for visibility.

## Usage Notes

- The toast will automatically disappear after a set duration (not implemented in this version).
- The component currently does not manage multiple toasts or their dismissal; this can be implemented with global state management solutions like Redux or Context API.

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

type Story = StoryObj<typeof Toast>;

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
