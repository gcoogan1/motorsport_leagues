import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import ImageUploadInput from "./ImageUploadInput";

// -- Meta Configuration -- //

const meta: Meta<typeof ImageUploadInput> = {
  title: "Components/Inputs/ImageUploadInput",
  component: ImageUploadInput,
  decorators: [withAppTheme],
  argTypes: {
    isAvatar: {
      control: "boolean",
      description: "If true, displays the upload as an avatar component",
    },
    avatarType: {
      control: "select",
      options: ["none", "black", "blue", "green", "red", "yellow", "email"],
      description: "Avatar variant to display when isAvatar is true",
    },
    helperMessage: {
      control: "text",
      description: "Helper text displayed below the upload button",
    },
    hasError: {
      control: "boolean",
      description: "If true, displays error state",
    },
    errorMessage: {
      control: "text",
      description: "Error message to display when hasError is true",
    },
    onChange: {
      description: "Callback function triggered when a file is selected",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **ImageUploadInput** component provides an interface for uploading and previewing images. It supports both standard image previews and avatar-specific displays.

### Features:

**Avatar mode:** Display uploads as avatar components with various styles.

**Image preview:** Shows uploaded images immediately.

**Error handling:** Supports error states with custom messages.

**Helper text:** Provides guidance to users.

**File validation:** Accepts only image files.

### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`isAvatar\` | \`boolean\` | \`false\` | If true, renders the upload as an avatar component. |
| \`avatarType\` | \`AvatarVariants\` | \`-\` | Specifies the avatar variant when isAvatar is true. |
| \`helperMessage\` | \`string\` | \`-\` | Helper text displayed below the upload button. |
| \`hasError\` | \`boolean\` | \`false\` | If true, displays the error state. |
| \`errorMessage\` | \`string\` | \`-\` | Error message displayed when hasError is true. |
| \`onChange\` | \`(file: File) => void\` | \`-\` | Callback function triggered when a file is selected. |

### Usage Notes:
- The component only accepts image files (image/*).
- When using avatar mode, be sure to specify an avatarType.
- The onChange callback receives the selected File object for further processing.
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

type Story = StoryObj<typeof ImageUploadInput>;

export const Default: Story = {
  args: {
    helperMessage: "Supported formats: JPG, PNG, GIF (Max 5MB)",
  },
};

export const WithAvatar: Story = {
  args: {
    isAvatar: true,
    avatarType: "blue",
    helperMessage: "Upload your profile picture",
  },
};

export const AvatarVariants: Story = {
  args: {
    isAvatar: true,
    avatarType: "green",
    helperMessage: "Try different avatar styles",
  },
};

export const WithError: Story = {
  args: {
    helperMessage: "Supported formats: JPG, PNG, GIF (Max 5MB)",
    hasError: true,
    errorMessage: "File size exceeds 5MB limit",
  },
};

export const AvatarWithError: Story = {
  args: {
    isAvatar: true,
    avatarType: "red",
    helperMessage: "Upload your profile picture",
    hasError: true,
    errorMessage: "Invalid image format",
  },
};