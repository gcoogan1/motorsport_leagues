import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import UserProfile from "./UserProfile";

// -- Meta Configuration -- //

const meta: Meta<typeof UserProfile> = {
  title: "Components/Users/UserProfile",
  decorators: [withAppTheme],
  component: UserProfile,
  argTypes: {
    username: {
      control: "text",
    },
    information: {
      control: "text",
    },
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
    },
    avatarType: {
      control: "radio",
      options: ["preset", "upload"],
    },
    avatarValue: {
      control: "text",
    },
    tags: {
      control: false,
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **UserProfile** component displays a user's profile information including an avatar, username, optional information text, and optional tags.

### Features

- **Flexible Sizing**: Three size variants (small, medium, large) with different layouts
- **Avatar Integration**: Uses the Avatar component with size adaptation
- **Tags Support**: Optional tags that display alongside username
- **Responsive Layout**: Large variant stacks elements vertically, small/medium use horizontal layout
- **Overflow Protection**: Avatar maintains size while text content can truncate

### Props

| Prop          | Type                        | Default    | Description                                               |
|---------------|-----------------------------|------------|-----------------------------------------------------------|
| \`username\`    | \`string\`                    | \`-\`       | The username to display.                                  |
| \`information\` | \`string\`                    | \`-\`       | Optional secondary information text.                      |
| \`size\`        | \`"small" &#124; "medium" &#124; "large"\` | \`"medium"\` | Controls the overall size and layout of the component. |
| \`avatarType\`  | \`"preset" | "upload"\`      | \`-\`       | Whether to use a preset avatar or uploaded image.         |
| \`avatarValue\` | \`AvatarVariants \\| string\`  | \`-\`       | The avatar variant name or image URL.                     |
| \`tags\`        | \`string[]\`                  | \`-\`       | Optional array of tag strings to display.                 |

### Layout Differences by Size

- **Small**: Tiny avatar, horizontal username + tags, information below
- **Medium**: Medium avatar, horizontal username + tags, information below
- **Large**: Large avatar, vertical layout (username → information → tags)

### Usage Notes

- The avatar wrapper has \`flex-shrink: 0\` to prevent avatar from shrinking
- Text container has \`min-width: 0\` to allow proper text truncation
- Tags automatically render when provided and non-empty
- Tags can be any variant defined in the Tags component (e.g., "host", "driver", "champion")
- Information text is optional and only renders when provided
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {
  args: {
    username: "JohnDoe",
    avatarType: "preset",
    avatarValue: "blue",
  },
};

export const WithInformation: Story = {
  args: {
    username: "JaneSmith",
    information: "Gran Turismo 7",
    avatarType: "preset",
    avatarValue: "red",
  },
};

export const WithSingleTag: Story = {
  args: {
    username: "TomJohnson",
    information: "F1 24",
    avatarType: "preset",
    avatarValue: "green",
    tags: ["host"],
  },
};

export const WithMultipleTags: Story = {
  args: {
    username: "AliceWilliams",
    information: "iRacing",
    avatarType: "preset",
    avatarValue: "yellow",
    tags: [
      "host", "driver", "champion"
    ],
  },
};

export const SmallSize: Story = {
  args: {
    username: "SmallUser",
    information: "Assetto Corsa",
    size: "small",
    avatarType: "preset",
    avatarValue: "black",
    tags: ["broadcast", "founder"],
  },
};

export const MediumSize: Story = {
  args: {
    username: "MediumUser",
    information: "Gran Turismo 7",
    size: "medium",
    avatarType: "preset",
    avatarValue: "blue",
    tags: ["staff", "driver"],
  },
};

export const LargeSize: Story = {
  args: {
    username: "LargeUser",
    information: "F1 24",
    size: "large",
    avatarType: "preset",
    avatarValue: "red",
    tags: ["staff", "driver"],
  },
};

export const LargeWithoutTags: Story = {
  args: {
    username: "ProfileUser",
    information: "Professional Driver",
    size: "large",
    avatarType: "preset",
    avatarValue: "green",
  },
};

export const LongUsername: Story = {
  render: (args) => (
    <div style={{ width: "200px" }}>
      <UserProfile {...args} />
    </div>
  ),
  args: {
    username: "VeryLongUsernameExample",
    information: "Gran Turismo 7",
    avatarType: "preset",
    avatarValue: "blue",
    tags: ["steward", "host", "champion"],
  },
};

export const MinimalSmall: Story = {
  args: {
    username: "MinimalUser",
    size: "small",
    avatarType: "preset",
    avatarValue: "yellow",
  },
};

export const NoAvatar: Story = {
  args: {
    username: "NoAvatarUser",
    information: "iRacing",
    size: "medium",
    avatarType: "preset",
    avatarValue: "none",
    tags: ["driver"],
  },
};
