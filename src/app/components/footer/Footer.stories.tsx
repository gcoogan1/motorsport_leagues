import type { Meta, StoryObj } from "@storybook/react";
import Footer from "./Footer";

// -- Meta Configuration -- //

const meta: Meta<typeof Footer> = {
  title: "App/components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
