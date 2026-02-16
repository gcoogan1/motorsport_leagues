import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ProfileList, { type ProfileListItem } from "./ProfileList";

// -- Meta Configuration -- //

const meta: Meta<typeof ProfileList> = {
  title: "Components/Lists/ProfileList",
  decorators: [withAppTheme],
  component: ProfileList,
  argTypes: {
    items: {
      control: false,
    },
    onClick: {
      control: false,
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **ProfileList** component displays a list of user profiles with actions. Each profile shows a UserProfile component alongside an action button (typically a menu button).

### Features

- **Profile Display**: Shows username, avatar, optional information, and tags
- **Action Button**: Each profile has a menu button for additional actions
- **Click Handler**: Optional onClick callback for profile actions
- **Responsive Layout**: Profiles are displayed in a vertical list with consistent spacing

### Props

| Prop      | Type                  | Default | Description                                          |
|-----------|-----------------------|---------|------------------------------------------------------|
| \`items\`   | \`ProfileListItem[]\`   | \`[]\`   | Array of profile items to display in the list.       |
| \`onClick\` | \`(username: string) => void\` | \`-\`    | Optional callback when action button is clicked. |

### ProfileListItem Structure

\`\`\`typescript
type ProfileListItem = {
  username: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
  information?: string;
  tags?: Tag[];
}
\`\`\`

### Usage Notes

- Each profile includes a three-dot menu button for actions
- The UserProfile component is wrapped to handle overflow properly
- Profile usernames should be unique to serve as keys
- The onClick handler currently passes "add_new" but should be updated to pass the username
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Mock Data -- //

const mockProfiles: ProfileListItem[] = [
  {
    username: "JohnDoe",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "blue",
    },
    information: "Gran Turismo 7",
    tags: ['director', 'host'],
  },
  {
    username: "JaneSmith",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "red",
    },
    information: "F1 24",
    tags: ['host', 'driver'],
  },
  {
    username: "TomJohnson",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "green",
    },
    information: "iRacing",
  },
  {
    username: "AliceWilliams",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "yellow",
    },
    information: "Assetto Corsa",
    tags: [
      "driver"
    ],
  },
];

// -- Stories -- //

type Story = StoryObj<typeof ProfileList>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "432px" }}>
      <ProfileList {...args} />
    </div>
  ),
  args: {
    items: mockProfiles,
    onClick: (username) => alert(`Clicked menu for ${username}`),
  },
};

export const SingleProfile: Story = {
  render: (args) => (
    <div style={{ width: "432px" }}>
      <ProfileList {...args} />
    </div>
  ),
  args: {
    items: [mockProfiles[0]],
    onClick: (username) => alert(`Clicked menu for ${username}`),
  },
};

export const WithoutTags: Story = {
  render: (args) => (
    <div style={{ width: "432px" }}>
      <ProfileList {...args} />
    </div>
  ),
  args: {
    items: [
      {
        username: "UserOne",
        avatar: {
          avatarType: "preset",
          avatarValue: "black",
        },
        information: "Gran Turismo 7",
      },
      {
        username: "UserTwo",
        avatar: {
          avatarType: "preset",
          avatarValue: "blue",
        },
        information: "F1 24",
      },
    ],
    onClick: (username) => alert(`Clicked menu for ${username}`),
  },
};

export const WithoutInformation: Story = {
  render: (args) => (
    <div style={{ width: "432px" }}>
      <ProfileList {...args} />
    </div>
  ),
  args: {
    items: [
      {
        username: "MinimalUser1",
        avatar: {
          avatarType: "preset",
          avatarValue: "red",
        },
        tags: ["driver"],
      },
      {
        username: "MinimalUser2",
        avatar: {
          avatarType: "preset",
          avatarValue: "green",
        },
        tags: ["host"],
      },
    ],
    onClick: (username) => alert(`Clicked menu for ${username}`),
  },
};

export const ManyProfiles: Story = {
  render: (args) => (
    <div style={{ width: "432px" }}>
      <ProfileList {...args} />
    </div>
  ),
  args: {
    items: [
      ...mockProfiles,
      {
        username: "UserFive",
        avatar: {
          avatarType: "preset",
          avatarValue: "black",
        },
        information: "Project CARS 3",
        tags: ["driver"],
      },
      {
        username: "UserSix",
        avatar: {
          avatarType: "preset",
          avatarValue: "blue",
        },
        information: "Dirt Rally 2.0",
      },
      {
        username: "UserSeven",
        avatar: {
          avatarType: "preset",
          avatarValue: "red",
        },
        information: "ACC",
        tags: ["director", "host"],
      },
    ],
    onClick: (username) => alert(`Clicked menu for ${username}`),
  },
};