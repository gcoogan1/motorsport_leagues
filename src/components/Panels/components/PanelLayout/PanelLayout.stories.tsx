
import type { Meta, StoryFn } from '@storybook/react';

import PanelLayout from "./PanelLayout";
import { withAppProviders } from "@/app/design/storybook/withAppProviders";
import { withAppTheme } from '@/app/design/storybook/withAppTheme';


const meta: Meta<typeof PanelLayout> = {
  title: "components/Panels/PanelLayout",
  decorators: [withAppTheme, withAppProviders],
  component: PanelLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **PanelLayout** component provides a structured layout for panels within the application. It supports features such as titles, tabs, and action buttons, allowing for a flexible and consistent panel design.

### Features

- Displays a panel title.
- Supports optional tabs for navigation within the panel.
- Includes primary and secondary action buttons.

### Props
| Prop          | Type                     | Default       | Description                                                  | 
|---------------|--------------------------|---------------|--------------------------------------------------------------|
| \`panelTitle\` | \`string\`                | \`""\`          | The title text displayed at the top of the panel.            |
| \`tabs\`         | \`Array<{ label: string; shouldExpand?: boolean }>\` | \`[]\`          | An array of tab objects, each containing a label and an optional flag to indicate if the tab should expand. |
| \`actions\`    | \`object\`                | \`undefined\`  | Configuration for primary and secondary action buttons.       |
| \`actions.primary\` | \`object\`            | \`undefined\`  | Configuration for the primary action button.                  |
| \`actions.primary.label\` | \`string\`      | \`""\`          | Label for the primary action button.                          |
| \`actions.primary.action\` | \`() => void\`  | \`undefined\`  | Action to perform when the primary button is clicked.         |
| \`actions.secondary\` | \`object\`          | \`undefined\`  | Configuration for the secondary action button.                |
| \`actions.secondary.label\` | \`string\`    | \`""\`          | Label for the secondary action button.                        |
| \`actions.secondary.action\` | \`() => void\`| \`undefined\`  | Action to perform when the secondary button is clicked.       |


### Usage Notes

- Use the PanelLayout component to create consistent panel designs across the application.
- Customize the panel by providing titles, tabs, and actions as needed.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn<typeof PanelLayout> = (args) => (
  <PanelLayout {...args}>
    <p style={{ color: "white"} }>This is example content: any inside the panel.</p>
  </PanelLayout>
);


export const Default = Template.bind({});
Default.args = {
  panelTitle: "Default Panel",
};

export const WithTabs = Template.bind({});
WithTabs.args = {
  panelTitle: "Panel with Tabs",
  tabs: [{ label: "Tab 1" }, { label: "Tab 2" }],
};

export const WithActions = Template.bind({});
WithActions.args = {
  panelTitle: "Panel with Actions",
  actions: {
    primary: {
      label: "Save",
      action: () => alert("Primary action clicked"),
    },
    secondary: {
      label: "Cancel",
      action: () => alert("Secondary action clicked"),
    },
  },
};

export const TabsAndActions = Template.bind({});
TabsAndActions.args = {
  panelTitle: "Full Panel",
  tabs: [{ label: "Overview", shouldExpand: true }, { label: "Settings" }],
  actions: {
    primary: {
      label: "Save",
      action: () => alert("Saved!"),
    },
    secondary: {
      label: "Cancel",
      action: () => alert("Cancelled!"),
    },
  },
};
