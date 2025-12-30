import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import  Panel from "./Panel";

const Meta: Meta<typeof Panel> = {
  title: "App/Components/Panels",
  component: Panel,
  parameters: {
    layout: "centered",
  },
  decorators: [withAppTheme],
  tags: ["autodocs"],
  argTypes: {
    types: {
      control: { type: "select", options: ["account", "profile"] },
    },
  },
};

export default Meta;

type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: (args) => <div><Panel {...args} /></div>,
  args: {
    types: "account",
  },
};