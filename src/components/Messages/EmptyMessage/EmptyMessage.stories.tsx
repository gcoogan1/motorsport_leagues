import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
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
| \`actions\`       | \`object\`                | \`undefined\` | An object containing optional primary and secondary action buttons. |
| \`actions.primary\`   | \`object\`                | \`undefined\` | Configuration for the primary action button.                 |
| \`actions.primary.onClick\` | \`() => void\`      | \`undefined\` | Function to call when the primary button is clicked.         |
| \`actions.primary.label\`   | \`string\`          | \`""\`          | Label text for the primary button.                           |
| \`actions.primary.rightIcon\` | \`React.ReactNode\` | \`undefined\` | Optional right icon for the primary button.                  |
| \`actions.primary.leftIcon\`  | \`React.ReactNode\` | \`undefined\` | Optional left icon for the primary button.                   |
| \`actions.secondary\` | \`object\`                | \`undefined\` | Configuration for the secondary action button.               |
| \`actions.secondary.onClick\` | \`() => void\`      | \`undefined\` | Function to call when the secondary button is clicked.       |
| \`actions.secondary.label\`   | \`string\`          | \`""\`          | Label text for the secondary button.                         |
| \`actions.secondary.rightIcon\` | \`React.ReactNode\` | \`undefined\` | Optional right icon for the secondary button.                |
| \`actions.secondary.leftIcon\`  | \`React.ReactNode\` | \`undefined\` | Optional left icon for the secondary button.                 |

## Features

Customizable title and subtitle text.

Option to provide a custom icon or use the default empty icon.

Supports primary and secondary action buttons.

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
    actions: { control: false },
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
    actions: {
      primary: {
        onClick: () => {},
        label: "Primary Action",
      },
      secondary: {
        onClick: () => {},
        label: "Secondary Action",
      },
    },
  },
  render: (args) => <div style={{ width: '500px', display: 'flex', justifyContent: 'center' }}><EmptyMessage {...args} /></div>,
}