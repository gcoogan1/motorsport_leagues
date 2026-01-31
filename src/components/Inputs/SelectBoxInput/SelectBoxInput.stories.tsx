import type { Meta, StoryObj } from "@storybook/react";
import SelectBoxInput from "./SelectBoxInput";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import GameGt7 from "@assets/Graphics/Game_GT7.svg?react";
import GameIRace from "@assets/Graphics/Game_iRacing.svg?react";
import GameAce from "@assets/Graphics/Game_ACEvo.svg?react";

// ---  Meta Configuration --- //

const meta: Meta<typeof SelectBoxInput> = {
  title: "Components/Inputs/SelectBoxInput",
  component: SelectBoxInput,
  decorators: [withAppTheme],
  argTypes: {
    options: {
      control: "object",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **SelectBoxInput** component is a composite UI element that allows users to select one option from a list of selectable boxes. Each option is represented by a **SelectBox** component, which displays a label and an optional helper message. The selected option is visually indicated, providing clear feedback to the user.

### Props

| Prop      | Type       | Default | Description                                                                 |
|-----------|------------|---------|-----------------------------------------------------------------------------|
| \`options.label\` | \`string\` |         | The text label displayed on each SelectBox option.                          |
| \`options.value\` | \`string\` |         | The unique value associated with each SelectBox option.                     |
| \`options.helperMessage\` | \`string\` | \`undefined\` | An optional helper message displayed below the label in each SelectBox.      |
| \`options.icon\` | \`React.ReactNode\` | \`undefined\` | An optional icon displayed alongside the label in each SelectBox.      |
| \`defaultSelected\` | \`string\` | \`undefined\` | The value of the option that should be selected by default when the component mounts. |

### Features

- Renders a list of **SelectBox** components based on the provided options.
- Manages the selected state internally, allowing users to select one option at a time.
- Provides visual feedback for the selected option.

### Usage Notes

- The component currently manages its own selected state. Future enhancements may include allowing parent components to control the selected state via \`onChange\` and \`value\` props.
- Each option should have a unique \`value\` to ensure proper selection handling.

        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ---  Stories --- //

type Story = StoryObj<typeof SelectBoxInput>;

export const Default: Story = {
  args: {
    options: [
      {
        label: "Option 1",
        value: "option1",
        helperMessage: "This is the first option.",
        icon: <GameGt7 />,
      },
      {
        label: "Option 2",
        value: "option2",
        helperMessage: "This is the second option.",
        icon: <GameIRace />,
      },
      {
        label: "Option 3",
        value: "option3",
        helperMessage: "This is the third option.",
        icon: <GameAce />,
      },
    ],
  },
};

export const WithDefaultSelected: Story = {
  args: {
    options: [
      {
        label: "Option 1",
        value: "option1",
        helperMessage: "This is the first option.",
      },
      {
        label: "Option 2",
        value: "option2",
        helperMessage: "This is the second option.",
      },
      {
        label: "Option 3",
        value: "option3",
        helperMessage: "This is the third option.",
      },
    ],
    defaultSelected: "option2",
  },
};
