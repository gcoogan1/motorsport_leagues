import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import { FormProviderMock } from "@/providers/mock/FormProviderMock";
import ImageUploadInput from "./ImageUploadInput";

// -- Meta Configuration -- //

const meta: Meta<typeof ImageUploadInput> = {
  title: "Components/Inputs/ImageUploadInput",
  component: ImageUploadInput,
  decorators: [withAppTheme],
  argTypes: {
    name: {
      control: false,
      description: "The name of the form field",
    },
    isAvatar: {
      control: "boolean",
      description: "If true, displays the upload as an avatar component",
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
| \`name\` | \`"avatar"\` | \`-\` | The name of the form field. |
| \`isAvatar\` | \`boolean\` | \`false\` | If true, renders the upload as an avatar component. |
| \`helperMessage\` | \`string\` | \`-\` | Helper text displayed below the upload button. |
| \`hasError\` | \`boolean\` | \`false\` | If true, displays the error state. |
| \`errorMessage\` | \`string\` | \`-\` | Error message displayed when hasError is true. |

### Usage Notes:
- The component only accepts image files (image/*).
- Requires React Hook Form context with avatar form data to function properly.
- Avatar variant is determined by form data, not a direct prop.
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
    name: "avatar",
    helperMessage: "Supported formats: JPG, PNG, GIF (Max 5MB)",
  },
  render: (args) => (
    <FormProviderMock>
      <ImageUploadInput {...args} />
    </FormProviderMock>
  ),
};

// Displays default "black" avatar (set in component logic)
export const WithAvatar: Story = {
  args: {
    name: "avatar",
    isAvatar: true,
    helperMessage: "Upload your profile picture",
  },
  render: (args) => (
    <FormProviderMock>
      <ImageUploadInput {...args} />
    </FormProviderMock>
  ),
};

export const WithError: Story = {
  args: {
    name: "avatar",
    helperMessage: "Supported formats: JPG, PNG, GIF (Max 5MB)",
    hasError: true,
    errorMessage: "File size exceeds 5MB limit",
  },
  render: (args) => (
    <FormProviderMock>
      <ImageUploadInput {...args} />
    </FormProviderMock>
  ),
};

// Displays default "black" avatar (set in component logic)
export const AvatarWithError: Story = {
  args: {
    name: "avatar",
    isAvatar: true,
    helperMessage: "Upload your profile picture",
    hasError: true,
    errorMessage: "Invalid image format",
  },
  render: (args) => (
    <FormProviderMock>
      <ImageUploadInput {...args} />
    </FormProviderMock>
  ),
};