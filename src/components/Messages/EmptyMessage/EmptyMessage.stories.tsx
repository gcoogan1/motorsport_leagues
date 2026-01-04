import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import Button from "@/components/Button/Button";
import EmptyMessage from "./EmptyMessage";

// -- Meta Configuration -- //

const meta: Meta<typeof EmptyMessage> = {
  title: "Components/Messages/EmptyMessage",
  component: EmptyMessage,
  decorators: [withAppTheme],
  parameters: {
    layout: "centered",
      docs: {
    description: {
      component: `

The **EmptyMessage** component is used to display a standardized message when a section of the application has no content to show. It includes an icon, title, subtitle, and optional action buttons.

## Props

| Prop             | Type                     | Default       | Description                                                  |  
|------------------|--------------------------|---------------|--------------------------------------------------------------|
| \`title\`          | \`string\`                | \`"No Data Available"\` | The main title text displayed in the empty message.          |
| \`subtitle\`       | \`string\`                | \`"There is currently no data to display."\` | The subtitle text providing additional context.              |
| \`icon\`          | \`React.ReactNode\`       | \`Default Empty Icon\` | The icon displayed above the title. If not provided, a default empty state icon is used. |
| \`primaryButton\`   | \`React.ReactNode\`       | \`undefined\` | An optional primary action button displayed below the subtitle. |
| \`secondaryButton\` | \`React.ReactNode\`       | \`undefined\` | An optional secondary action button displayed below the subtitle. | 

## Features

Customizable title and subtitle text.

Option to provide a custom icon or use the default empty icon.

Supports primary and secondary action buttons, which are automatically set to full width for consistent layout.

## Usage Notes

- If no icon is provided, a default empty state icon will be displayed.
- Icons are automatically rendered at **48×48**
- Primary and secondary buttons are always **full-width**

      `,
    },
  },
  },
  argTypes: {
    title: {
      control: "text",
    },
    subtitle: {
      control: "text",
    },
    icon: { control: false },
    primaryButton: { control: false },
    secondaryButton: { control: false },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof EmptyMessage>;

export const Default: Story = {};


export const WithCustomIcon: Story = {
  args: {
    title: "No Profile Found",
    subtitle: "Please create a profile to get started.",
    icon: <ProfileIcon />,
  },
  render: (args) => <div style={{ width: '500px', display: 'flex', justifyContent: 'center' }}><EmptyMessage {...args} /></div>,
}

export const WithActions: Story = {
  args: {
    primaryButton: <Button color="base" onClick={() => {}}>Button Label</Button>,
    secondaryButton: <Button color="base" variant="outlined" onClick={() => {}}>Button Label</Button>,
  },
  render: (args) => <div style={{ width: '500px', display: 'flex', justifyContent: 'center' }}><EmptyMessage {...args} /></div>,
}