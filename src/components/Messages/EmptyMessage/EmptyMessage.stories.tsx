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

| Prop             | Type                                               | Default               | Description                                                  |
|------------------|----------------------------------------------------|-----------------------|--------------------------------------------------------------|
| \`title\`        | \`string\`                                         | \`"Empty Section"\`   | The main title text displayed in the empty message.          |
| \`subtitle\`     | \`string\`                                         | \`"This section is currently empty!"\` | The subtitle text providing additional context.              |
| \`icon\`         | \`React.ReactNode\`                                | \`<EmptyIcon />\`     | Custom icon to display above the title.                      |
| \`primaryButton\`| \`React.ReactElement<{ fullWidth?: boolean }>\` | \`undefined\`         | Primary action button displayed below the text.              |
| \`secondaryButton\`| \`React.ReactElement<{ fullWidth?: boolean }>\` | \`undefined\`         | Secondary action button displayed below the text.            |

## Features

- Customizable title and subtitle text.
- Option to provide a custom icon or use the default empty icon.
- Supports primary and secondary action buttons, which are automatically set to full width for consistent layout.

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