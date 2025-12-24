import type { Meta, StoryObj } from "@storybook/react";
import Homepage from "./Homepage";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import type { ThemeName } from "@/app/design/tokens/theme";

// Storybook metadata for the Homepage component
const meta: Meta<typeof Homepage> = {
  title: "Pages/Homepage",
  component: Homepage,
  decorators: [withAppTheme],
  parameters: {
    layout: "fullscreen",
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
};

export default meta;

type Story = StoryObj<typeof Homepage>;

export const Default: Story = {};
