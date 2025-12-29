import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import Navbar from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "App/Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    usage: {
      control: "radio",
      options: ["core", "user", "guest"],
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
    withAppTheme,
  ],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    usage: "user",
  }
};
