import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import { withAppProviders } from "@/app/design/storybook/withAppProviders";
import Navbar from "./Navbar";

// -- Meta Configuration -- //

const meta: Meta<typeof Navbar> = {
  title: "App/Components/Navbar",
  decorators: [withAppTheme, withAppProviders],
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Navbar** component serves as the primary navigation bar for the application. It adapts its content and layout based on the user's authentication status and role (core user, authenticated user, or guest).

### Props

| Prop    | Type                | Default       | Description                                                  |
|---------|---------------------|---------------|--------------------------------------------------------------|
| \`usage\` | \`"core" | "user" | "guest"\` | \`"user"\` | Determines the type of navbar to display based on user status. |

### Features

**Core Navbar**: Displays navigation options for core users with elevated privileges.

**User Navbar**: Standard navigation options for authenticated users.

**Guest Navbar**: Limited navigation options for unauthenticated users.

### Usage Notes

- The \`usage\` prop controls which version of the navbar is rendered.
- Ensure that the appropriate user context is provided when using this component to reflect the correct navigation options.
        `,

      },
    },
  },
  argTypes: {
    usage: {
      control: "radio",
      options: ["core", "user", "guest"],
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    usage: "user",
  }
};

export const CoreNavbar: Story = {
  args: {
    usage: "core",
  }
};

export const GuestNavbar: Story = {
  args: {
    usage: "guest",
  }
};
