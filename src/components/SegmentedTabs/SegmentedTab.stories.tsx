
import SegmentedTab from "./SegmentedTab";
import { withAppProviders } from "@/app/design/storybook/withAppProviders";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof SegmentedTab> = {
  title: "Components/SegmentedTab",
  component: SegmentedTab,
  decorators: [withAppProviders, withAppTheme],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **SegmentedTab** component provides a user interface element that allows users to switch between different views or sections by selecting from a set of tabs. It is commonly used in scenarios where content needs to be organized into distinct categories or sections.

### Props

| Prop            | Type                     | Default       | Description                                                  |
|-----------------|--------------------------|---------------|--------------------------------------------------------------|
| \`tabs\`         | \`string[]\`              | \`[]\`         | An array of strings representing the labels of each tab.     |
| \`activeTab\`    | \`string\`                | \`""\`          | The label of the currently active tab.                        |
| \`shouldExpand\` | \`boolean\`               | \`false\`      | Determines whether the active tab should expand. |
| \`onChange\`      | \`(tab: string) => void\` | \`() => {}\`   | Callback function invoked when a tab is selected, receiving the selected tab label as an argument. |

### Features

- Displays a horizontal list of tabs.
- Highlights the active tab.
- Supports expanding the active tab.
- Invokes a callback function when a tab is selected.

### Usage Notes

- Use the \`activeTab\` prop to control which tab is currently selected.
- The \`onChange\` callback is essential for handling tab selection changes.

        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SegmentedTab>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeTab, setActiveTab] = useState("Primary");
    const tabs = ["Primary", "Secondary"];

    return (
      <div style={{ padding: "20px", maxWidth: "480px" }}>
        <SegmentedTab
          tabs={tabs}
          activeTab={activeTab}
          shouldExpand
          onChange={setActiveTab}
        />
      </div>
    );
  },
};

export const WithoutExpand: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Details", "Settings"];

    return (
      <div style={{ padding: "20px", maxWidth: "480px" }}>
        <SegmentedTab
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
    );
  },
};
