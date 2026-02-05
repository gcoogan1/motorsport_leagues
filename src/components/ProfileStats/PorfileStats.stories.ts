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
| \`stats\` | \`Stat[]\` | \`-\` | Array of stat objects with \`number\` and \`label\` properties. |

### Stat Object:
| Property | Type | Description |
|----------|------|-------------|
| \`number\` | \`number\` | The numeric value to display. |
| \`label\` | \`string\` | The label describing the statistic. |

### Usage Notes:
- Stats are rendered in the order they're provided in the array.
- Each stat displays a large number followed by a descriptive label.
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
      { number: 24, label: "Wins" },
      { number: 8, label: "Losses" },
      { number: 3, label: "Championships" },
    ],
  },
};

export const SingleStat: Story = {
  args: {
    stats: [{ number: 42, label: "Total Races" }],
  },
};

export const ManyStat: Story = {
  args: {
    stats: [
      { number: 156, label: "Points" },
      { number: 45, label: "Wins" },
      { number: 12, label: "Podiums" },
      { number: 5, label: "Championships" },
      { number: 3, label: "Records" },
    ],
  },
};

export const LargeNumbers: Story = {
  args: {
    stats: [
      { number: 10500, label: "Total Points" },
      { number: 250, label: "Races Completed" },
      { number: 98, label: "Win Rate %" },
    ],
  },
};

export const AchievementStats: Story = {
  args: {
    stats: [
      { number: 2, label: "Gold Medals" },
      { number: 5, label: "Silver Medals" },
      { number: 8, label: "Bronze Medals" },
    ],
  },
};