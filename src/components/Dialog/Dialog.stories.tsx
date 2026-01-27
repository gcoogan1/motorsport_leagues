
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
| \`buttons\`      | \`object\`                 | \`undefined\`  | Configuration for the continue and cancel buttons.           |
| \`buttons.onCancel\` | \`object\`             | \`undefined\`  | Configuration for the cancel button.                          |
| \`buttons.onContinue\` | \`object\`          | \`undefined\`  | Configuration for the continue button.                        |
| \`buttons.onCancel.label\` | \`string\`     | \`"Cancel"\`   | Label for the cancel button.                                  |
| \`buttons.onCancel.action\` | \`() => void\` | \`undefined\`  | Action to perform when the cancel button is clicked.          |
| \`buttons.onCancel.leftIon\` | \`React.ReactNode\` | \`undefined\`  | Optional left icon for the cancel button.                     |
| \`buttons.onCancel.rightIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional right icon for the cancel button.                    |
| \`buttons.onCancel.loading\` | \`boolean\` | \`undefined\`  | Loading state for the cancel button.                           |
| \`buttons.onCancel.loadingText\` | \`string\` | \`undefined\`  | Loading text for the cancel button.                            |
| \`buttons.onContinue.label\` | \`string\`    | \`"Continue"\` | Label for the continue button.                                |
| \`buttons.onContinue.action\` | \`() => void\`| \`undefined\`  | Action to perform when the continue button is clicked.         |
| \`buttons.onContinue.leftIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional left icon for the continue button.                   |
| \`buttons.onContinue.rightIcon\` | \`React.ReactNode\` | \`undefined\`  | Optional right icon for the continue button.                  |
| \`buttons.onContinue.loading\` | \`boolean\` | \`undefined\`  | Loading state for the continue button.                        |
| \`buttons.onContinue.loadingText\` | \`string\` | \`undefined\`  | Loading text for the continue button.                         |

### Usage Notes

- Ensure to provide meaningful titles and subtitles to convey the purpose of the dialog effectively.
- Use the \`buttons\` prop to define actions users can take, such as confirming or canceling an operation.


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
    
  },
};

export const CoreDialog: Story = {
  args: {
    type: "core",
    title: "Core Title",
    subtitle: "Dialog body text.",
    buttons: {
      onCancel: {
        label: "Cancel",
        action: () => {
          console.log("Cancel clicked");
        },
      },
      onContinue: {
        label: "Continue",
        action: () => {
          console.log("Continue clicked");
        },
      },
    },
    
  },
  render: (args) => <div style={{ width: '480px' }}><Dialog {...args} /></div>,
};

export const AlertDialog: Story = {
  args: {
    type: "alert",
    title: "Alert Title",
    subtitle: "Dialog body text.",
    buttons: {
      onCancel: {
        label: "Cancel",
        action: () => {
          console.log("Cancel clicked");
        },
      },
      onContinue: {
        label: "Continue",
        action: () => {
          console.log("Continue clicked");
        },
      },
    },
  },
  render: (args) => <div style={{ width: '480px' }}><Dialog {...args} /></div>,
};

export const SuccessDialog: Story = {
  args: {
    type: "success",
    title: "Success Title",
    subtitle: "Dialog body text.",
    buttons: {
      onCancel: {
        label: "Cancel",
        action: () => {
          console.log("Cancel clicked");
        },
      },
      onContinue: {
        label: "Continue",
        action: () => {
          console.log("Continue clicked");
        },
      },
    },
  
  },
  render: (args) => <div style={{ width: '480px' }}><Dialog {...args} /></div>,
};




