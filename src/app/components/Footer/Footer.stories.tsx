import type { Meta, StoryObj } from "@storybook/react";
import Footer from "./Footer";

// -- Meta Configuration -- //

const meta: Meta<typeof Footer> = {
  title: "App/components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Footer** component represents the footer section of the application, typically displayed at the bottom of the page. It contains links and information relevant to the overall site.

### Features

**Consistent Layout**: Provides a uniform footer across all pages of the application.

**Responsive Design**: Adapts to different screen sizes for optimal viewing on both desktop and mobile devices.

### Usage Notes

- The Footer component is designed to be used at the bottom of the main layout component to ensure it appears on all pages.

        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
