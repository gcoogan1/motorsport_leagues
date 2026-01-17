import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import PanelHeader from "./PanelHeader";
import Placeholder from "@assets/Icon/Placeholder.svg?react";

// -- Meta Configuration -- //

const Meta: Meta<typeof PanelHeader> = {
  title: "Components/Panels/components/PanelHeader",
  component: PanelHeader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`PanelHeader\` component is used to display the header section of a panel, including the title, an optional icon, and a close button. It supports shadow styling for visual depth.

### Props

| Prop            | Type                     | Default       | Description                                                  |
|-----------------|--------------------------|---------------|--------------------------------------------------------------|
| \`panelTitle\`    | \`string\`                 | \`""\`          | The title text to be displayed in the panel header.          |
| \`panelTitleIcon\` | \`React.ReactNode\`       | \`undefined\`  | An optional icon to display alongside the title.             |
| \`showShadow\`    | \`boolean\`                | \`false\`      | Determines whether to show a shadow below the header.        |
| \`onClose\`       | \`() => void\`            | \`() => {}\`   | Callback function invoked when the close button is clicked.  |


### Usage Notes

- The \`onClose\` prop is essential for handling panel closure actions.
- The \`showShadow\` prop can be toggled to fit different design requirements.

        `,
      },
    },
  },
  decorators: [withAppTheme],
  tags: ["autodocs"],
  argTypes: {
    panelTitle: {
      control: { type: "text" },
    },
    panelTitleIcon: {
      control: false,
    },
    showShadow: {
      control: { type: "boolean" },
    },
    onClose: {
      action: "closed",
    },
  },
};

export default Meta;

// -- Stories -- //

type Story = StoryObj<typeof PanelHeader>;

export const Default: Story = {
  args: {
    panelTitle: "Panel Title",
    panelTitleIcon: <Placeholder />,
    showShadow: true,
    onClose: () => alert("Panel closed"),
  },
};