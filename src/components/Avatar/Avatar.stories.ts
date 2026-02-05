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
    avatarType: {
      control: "select",
      options: ["preset", "upload"],
    },
    avatarValue: {
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
| \`avatarType\` | \`"preset" | "upload"\` | \`"preset"\` | Specifies whether to use a preset avatar or an uploaded image. |
| \`avatarValue\` | \`AvatarVariants | string\` | \`"default"\` | The preset avatar type or the URL of the uploaded image. |

### Usage Notes:

The Avatar component can be customized using the \`size\`, \`avatarType\`, and \`avatarValue\` props to fit different design requirements.

If \`avatarType\` is set to \`"upload"\`, ensure that \`avatarValue\` contains a valid image URL.

If \`avatarType\` is set to \`"preset"\`, choose from the available preset options defined in \`AvatarVariants\`. If "none" is selected, an empty placeholder avatar will be displayed.

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
    avatarType: "preset",
    avatarValue: "black",
  },
};

export const SmallBlueAvatar: Story = {
  args: {
    size: "small",
    avatarType: "preset",
    avatarValue: "blue",
  },
};

export const LargeRedAvatar: Story = {
  args: {
    size: "large",
    avatarType: "preset",
    avatarValue: "red",
  },
};

export const ExtraLargeGreenAvatar: Story = {
  args: {
    size: "xLarge",
    avatarType: "preset",
    avatarValue: "green",
  },
};

export const ExtraExtraLargeBlackAvatar: Story = {
  args: {
    size: "xxLarge",
    avatarType: "preset",
    avatarValue: "black",
  },
};

export const EmailAvatar: Story = {
  args: {
    size: "medium",
    avatarType: "preset",
    avatarValue: "email",
  },
};