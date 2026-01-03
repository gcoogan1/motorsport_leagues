import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import LinkList from "./LinkList";
import ChevRight from "@assets/Icon/Chevron_Right.svg?react";

// -- Meta Configuration -- //

const Meta: Meta<typeof LinkList> = {
  title: "App/Components/Lists/LinkList",
  component: LinkList,
  parameters: {
    layout: "centered",
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