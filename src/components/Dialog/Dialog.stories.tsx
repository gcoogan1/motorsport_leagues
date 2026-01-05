
import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";

import Dialog from "./Dialog";

// -- Meta Configuration -- //

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  decorators: [withAppTheme],
  component: Dialog,
  argTypes: {

  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Dialog** component is a versatile modal dialog box that can be used to display important information or prompt user actions. It supports different types such as \`core\`, \`alert\`, and \`success\`, each with its own styling.

**Note:** \`onClose\` does not currently close the dialog; this functionality needs to be implemented. The width is managed by a parent container of 480px in the stories for demonstration purposes.

### Features

Automatically styled by type: \`core\`, \`alert\`, \`success\`.

Customizable title and subtitle.

Callbacks for close and continue actions.


### Props

| Prop          | Type                     | Default       | Description                                                  | 
|---------------|--------------------------|---------------|--------------------------------------------------------------|
| \`type\`       | \`DialogType\`            | \`"core"\`     | The style type of the dialog, affecting its appearance.      |
| \`title\`      | \`string\`                 | \`""\`          | The main title text displayed at the top of the dialog.      |
| \`subtitle\`   | \`string\`                 | \`undefined\`  | An optional subtitle providing additional context.           |
| \`isOpen\`    | \`boolean\`                | \`false\`      | Controls whether the dialog is visible or hidden.            |
| \`onClose\`   | \`() => void\`            | \`() => {}\`   | Callback function invoked when the dialog is closed.         |
| \`onContinue\` | \`() => void\`            | \`() => {}\`   | Callback function invoked when the continue action is triggered. |

### Usage Notes

- The dialog will not render if \`isOpen\` is set to \`false\`.
- The \`onClose\` and \`onContinue\` props are essential for handling user interactions with the dialog.
    `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    type: "core",
    title: "Default Title",
    subtitle: "Dialog body text.",
    isOpen: true,
    onClose: () => {},
    onContinue: () => {},
  },
};

export const CoreDialog: Story = {
  args: {
    type: "core",
    title: "Core Title",
    subtitle: "Dialog body text.",
    isOpen: true,
    onClose: () => {},
    onContinue: () => {},
  },
  render: (args) => <div style={{ width: '480px' }}><Dialog {...args} /></div>,
};

export const AlertDialog: Story = {
  args: {
    type: "alert",
    title: "Alert Title",
    subtitle: "Dialog body text.",
    isOpen: true,
    onClose: () => {},
    onContinue: () => {},
  },
  render: (args) => <div style={{ width: '480px' }}><Dialog {...args} /></div>,
};

export const SuccessDialog: Story = {
  args: {
    type: "success",
    title: "Success Title",
    subtitle: "Dialog body text.",
    isOpen: true,
    onClose: () => {},
    onContinue: () => {},
  },
  render: (args) => <div style={{ width: '480px' }}><Dialog {...args} /></div>,
};




