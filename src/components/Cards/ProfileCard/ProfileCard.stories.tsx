import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ProfileCard from "./ProfileCard";

// -- Meta Configuration -- //

const meta: Meta<typeof ProfileCard> = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  decorators: [withAppTheme],
  argTypes: {
    type: {
      control: "select",
      options: ["none", "black", "blue", "green", "red", "yellow", "email"],
    },
    username: {
      control: "text",
    },
    userGame: {
      control: "text",
    },
    cardSize: {
      control: "select",
      options: ["small", "medium"],
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `

The **ProfileCard** component is used to display a user's profile information, including their avatar, username, and associated game. It supports different avatar types and card sizes.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`type\` | \`AvatarVariants\` | \`"blue"\` | The variant of the avatar to display (e.g., color or style). |
| \`username\` | \`string\` | \`-\` | The username of the profile to display. |
| \`userGame\` | \`string\` | \`-\` | The game associated with the profile. |
| \`cardSize\` | \`"small" | "medium"\` | \`"medium"\` | The size of the profile card. |

## Usage

This card is typically used in user profile sections, dashboards, or anywhere profile information needs to be displayed in a compact format.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  args: {
    type: "blue",
    username: "Username",
    userGame: "Game",
  },
};


export const RedAvatar: Story = {
  args: {
    type: "red",
    username: "Username",
    userGame: "Game",
  },
};

export const NoAvatar: Story = {
  args: {
    type: "none",
    username: "Username",
    userGame: "Game",
  },
};

export const SmallCard: Story = {
  args: {
    type: "green",
    username: "Username",
    userGame: "Game",
    cardSize: "small",
  },
};