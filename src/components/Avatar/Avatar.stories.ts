import type { Meta, StoryObj } from "@storybook/react";
import { getAvatarVariants, type AvatarSize, type AvatarVariants } from "./Avatar.variants";
import Avatar from "./Avatar";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";

// -- Meta Configuration -- //

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  decorators: [withAppTheme],
  argTypes: {
    size: {
      control: "select",
      options: ["tiny", "small", "medium", "large", "xLarge", "xxLarge"] satisfies AvatarSize[],
    },
    type: {
      control: "select",
      options: Object.keys(getAvatarVariants()) as AvatarVariants[],
    },
  },
  parameters: {
    docs: {
      description: {component: `
The **Avatar** component is used to display user profile images with various sizes and styles.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`size\` | \`"xxLarge" | "xLarge" | "large" | "medium" | "small" | "tiny"\` | \`"medium"\` | Defines the size of the avatar. |
| \`type\` | \`"none" | "black" | "blue" | "green" | "red" | "yellow" | "email"\` | \`"none"\` | Defines the avatar variant to display. |

### Usage Notes:

The Avatar component can be customized using the \`size\` and \`type\` props to fit various design requirements.

If \`type\` is set to \`"none"\`, no avatar image will be displayed.

      `},
    }
  },
  tags: ["autodocs"]
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    size: "medium",
    type: "none",
  },
};

export const SmallBlueAvatar: Story = {
  args: {
    size: "small",
    type: "blue",
  },
};

export const LargeRedAvatar: Story = {
  args: {
    size: "large",
    type: "red",
  },
};

export const ExtraLargeGreenAvatar: Story = {
  args: {
    size: "xLarge",
    type: "green",
  },
};

export const ExtraExtraLargeBlackAvatar: Story = {
  args: {
    size: "xxLarge",
    type: "black",
  },
};

export const EmailAvatar: Story = {
  args: {
    size: "medium",
    type: "email",
  },
};