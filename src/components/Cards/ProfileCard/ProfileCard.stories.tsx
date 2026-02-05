import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ProfileCard from "./ProfileCard";

// -- Meta Configuration -- //

const meta: Meta<typeof ProfileCard> = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  decorators: [withAppTheme],
  argTypes: {
    
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
    avatarType: {
      control: "select",
      options: ["preset", "upload"],
    },
    avatarValue: {
      control: "text",
      description: "The variant of the avatar to display (e.g., color or url).",
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
| \`username\` | \`string\` | \`-\` | The username of the profile to display. |
| \`userGame\` | \`string\` | \`-\` | The game associated with the profile. |
| \`cardSize\` | \`"small" | "medium"\` | \`"medium"\` | The size of the profile card. |
| \`avatarType\` | \`"preset" | "upload"\` | \`"preset"\` | The type of avatar to display. |
| \`avatarValue\` | \`string\` | \`-\` | The variant or URL of the avatar to display. |

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
    username: "Username",
    userGame: "Game",
    avatarType: "preset",
    avatarValue: "blue",
  },
};


export const RedAvatar: Story = {
  args: {
    avatarType: "preset",
    avatarValue: "red",
    username: "Username",
    userGame: "Game",
  },
};

export const NoAvatar: Story = {
  args: {
    avatarType: "preset",
    avatarValue: "none",
    username: "Username",
    userGame: "Game",
  },
};

export const SmallCard: Story = {
  args: {
    avatarType: "preset",
    avatarValue: "green",
    username: "Username",
    userGame: "Game",
    cardSize: "small",
  },
};