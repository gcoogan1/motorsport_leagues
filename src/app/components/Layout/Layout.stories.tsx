import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import { withAppProviders } from "@/app/design/storybook/withAppProviders";
import Layout from "./Layout";

// -- Meta Configuration -- //

const meta: Meta<typeof Layout> = {
  title: "App/Components/Layout",
  decorators: [withAppTheme, withAppProviders],
  component: Layout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **Layout** component serves as the main layout structure for pages within the application. It typically includes common elements such as the header, footer, and navigation, providing a consistent look and feel across different pages.

### Features

Wraps page content with consistent layout elements.

Integrates with routing to display nested page content.

### Usage Notes

  - Use the Layout component as a wrapper for pages to ensure uniformity in design.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;



// -- Stories -- //

type Story = StoryObj<typeof Layout>;


export const Default: Story = {}