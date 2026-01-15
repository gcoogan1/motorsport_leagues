import type { Meta, StoryObj } from "@storybook/react";
import Homepage from "./Homepage";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import type { ThemeName } from "@/app/design/tokens/theme";
import { MockAuthProvider } from "@/providers/mock/MockAuthProvider";
import { withAppProviders } from "@/app/design/storybook/withAppProviders";

// Storybook metadata for the Homepage component
const meta: Meta<typeof Homepage> = {
  title: "Pages/Homepage",
  component: Homepage,
  decorators: [withAppTheme, withAppProviders],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Homepage** component serves as the main landing page for the application. It provides users with an overview of key features and navigation options.

### Themes

The Homepage supports multiple themes to enhance user experience and align with branding preferences. The available themes are:

- **Yellow**
- **Blue**
- **Red**
- **Green**

### Usage Notes

- The Homepage component is designed to be responsive and adapt to various screen sizes.
- It is recommended to select a theme that aligns with the overall branding of the application.
        `,
      },
    },
  },
  argTypes: {
    themeName: {
      control: "select",
      options: ["yellow", "blue", "red", "green"] satisfies ThemeName[],
    },
  },
  args: {
    themeName: "yellow",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Homepage>;

export const Default: Story = {}
