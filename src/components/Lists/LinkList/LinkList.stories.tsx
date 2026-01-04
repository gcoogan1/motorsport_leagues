import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import LinkList from "./LinkList";
import ChevRight from "@assets/Icon/Chevron_Right.svg?react";

// -- Meta Configuration -- //

const Meta: Meta<typeof LinkList> = {
  title: "Components/Lists/LinkList",
  component: LinkList,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`LinkList\` component is designed to display a list of navigational links, each potentially accompanied by an icon and helper text. It is ideal for use in panels, or any context where a list of actionable items is required.


### Props

| Prop            | Type                     | Default       | Description                                                  |
|-----------------|--------------------------|---------------|--------------------------------------------------------------|
| \`sectionTitle\` | \`string\`                 | \`""\`          | The title of the link list section.                           |
| \`options\`      | \`Array<LinkOption>\`     | \`[]\`         | An array of link options to be displayed in the list.        |

### Usage Notes

- Each option in the \`options\` array should conform to the \`LinkOption\` type for proper rendering and functionality.

\` type LinkOption = {
  optionType: "text" | "profile";
  optionTitle: string;
  optionHelper?: string;
  optionIcon?: React.ReactNode;
  optionIconLabel?: string;
  onOptionClick: () => void;
};
\`

`,
      },
    },
  },
  decorators: [withAppTheme],
  tags: ["autodocs"],
  argTypes: {
    sectionTitle: { control: "text" },
    options: { control: "object" }
  },
};

export default Meta;

// -- Stories -- //

type Story = StoryObj<typeof LinkList>;

export const Default: Story = {
  render: (args) => <div style={{ width: "432px" }}><LinkList {...args} /></div>,
  args: {
    sectionTitle: "Section",
    options: [
      {
        optionType: "text",
        optionTitle: "Option",
        optionHelper: "This is the first option",
        optionIcon: <ChevRight />,
        optionIconLabel: "Go to Option 1",
        onOptionClick: () => alert("Option 1 clicked"),
      },
      {
        optionType: "text",
        optionTitle: "Option",
        optionHelper: "This is the second option",
        optionIcon: <ChevRight />,
        optionIconLabel: "Go to Option 2",
        onOptionClick: () => alert("Option 2 clicked"),
      },
    ],
  },
};

export const SingleOption: Story = {
  render: (args) => <div style={{ width: "432px" }}><LinkList {...args} /></div>,
  args: {
    sectionTitle: "Section",
    options: [
      {
        optionType: "text",
        optionTitle: "Option",
        optionHelper: "This is the only option",
        optionIcon: <ChevRight />,
        optionIconLabel: "Go to Only Option",
        onOptionClick: () => alert("Only Option clicked"),
      },
    ],
  },
};

export const ManyOptions: Story = {
  render: (args) => <div style={{ width: "432px" }}><LinkList {...args} /></div>,
  args: {
    sectionTitle: "Section",
    options: Array.from({ length: 5 }, (_, i) => ({
      optionType: "text",
      optionTitle: `Option ${i + 1}`,
      optionHelper: `This is option number ${i + 1}`,
      optionIcon: <ChevRight />,
      optionIconLabel: `Go to Option ${i + 1}`,
      onOptionClick: () => alert(`Option ${i + 1} clicked`),
    })),
  },
};