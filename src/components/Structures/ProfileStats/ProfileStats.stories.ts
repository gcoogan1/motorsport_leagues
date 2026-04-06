import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ProfileStats from "./ProfileStats";

// -- Meta Configuration -- //

const meta: Meta<typeof ProfileStats> = {
  title: "Components/ProfileStats",
  component: ProfileStats,
  decorators: [withAppTheme],
  argTypes: {
    stats: {
      control: false,
      description: "Array of stats to display with number and label",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **ProfileStats** component displays a collection of statistics, each with a number and a label. It's useful for showing user profile metrics like wins, losses, championships, etc.


### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`stats\` | \`Stat[]\` | \`-\` | Array of stat objects with \`number\`, \`labelStat\`, and \`labelFact\` properties. |

### Stat Object:
| Property | Type | Description |
|----------|------|-------------|
| \`number\` | \`number\` | The numeric value to display. |
| \`labelStat\` | \`string\` | The primary label describing the stat. |
| \`labelFact\` | \`string\` | A secondary label for additional context. |

### Usage Notes:
- Stats are rendered in the order they're provided in the array.
- Each stat displays a large number followed by a descriptive label and secondary label.
- Works well for displaying profile metrics and achievements.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof ProfileStats>;

export const Default: Story = {
  args: {
    stats: [
      { number: 24, labelStat: "Wins", labelFact: "Seasons" },
      { number: 8, labelStat: "Losses", labelFact: "Seasons" },
      { number: 3, labelStat: "Championships", labelFact: "Titles" },
    ],
  },
};

export const SingleStat: Story = {
  args: {
    stats: [{ number: 42, labelStat: "Total Races", labelFact: "Days" }],
  },
};

export const ManyStat: Story = {
  args: {
    stats: [
      { number: 156, labelStat: "Points", labelFact: "Earned" },
      { number: 45, labelStat: "Wins", labelFact: "Seasons" },
      { number: 12, labelStat: "Podiums", labelFact: "Seasons" },
      { number: 5, labelStat: "Championships", labelFact: "Titles" },
      { number: 3, labelStat: "Records", labelFact: "Seasons" },
    ],
  },
};

export const LargeNumbers: Story = {
  args: {
    stats: [
      { number: 10500, labelStat: "Total Points", labelFact: "Earned" },
      { number: 250, labelStat: "Races Completed", labelFact: "Events" },
      { number: 98, labelStat: "Win Rate %", labelFact: "Percentage" },
    ],
  },
};

export const AchievementStats: Story = {
  args: {
    stats: [
      { number: 2, labelStat: "Gold Medals", labelFact: "Awards" },
      { number: 5, labelStat: "Silver Medals", labelFact: "Awards" },
      { number: 8, labelStat: "Bronze Medals", labelFact: "Awards" },
    ],
  },
};