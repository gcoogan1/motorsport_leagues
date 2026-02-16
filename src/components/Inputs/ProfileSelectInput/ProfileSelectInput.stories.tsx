import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import { FormProviderMock } from "@/providers/mock/FormProviderMock";
import ProfileSelectInput from "./ProfileSelectInput";

// -- Meta Configuration -- //

const meta: Meta<typeof ProfileSelectInput> = {
  title: "Components/Inputs/ProfileSelectInput",
  decorators: [withAppTheme],
  component: ProfileSelectInput,
  argTypes: {
    name: {
      control: "text",
    },
    fieldLabel: {
      control: "text",
    },
    type: {
      control: "radio",
      options: ["profile", "driver"],
    },
    isLarge: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
    hasError: {
      control: "boolean",
    },
    errorMessage: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    profiles: {
      control: false,
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **ProfileSelectInput** component is a specialized dropdown input for selecting user profiles or drivers. It integrates with Radix UI Select for accessibility and uses a custom dropdown menu with avatars.

### Features

- **Avatar Display**: Shows user avatars with profile information
- **Custom Dropdown**: Uses MenuDropdown component with styled options
- **Radix UI Integration**: Built on @radix-ui/react-select for accessibility
- **React Hook Form Integration**: Seamlessly integrates with form state management
- **Selection Indicator**: Check icon appears on selected items
- **Keyboard Navigation**: Full keyboard support via Radix primitives

### Props

| Prop          | Type                        | Default              | Description                                               |
|---------------|-----------------------------|----------------------|-----------------------------------------------------------|
| \`name\`        | \`string\`                    | \`-\`                 | The name of the input field, used for form handling.      |
| \`fieldLabel\`  | \`string\`                    | \`-\`                 | The label displayed above the input field.                |
| \`type\`        | \`"profile" \| "driver"\`     | \`"profile"\`         | Determines avatar size and display style.                 |
| \`isLarge\`     | \`boolean\`                   | \`false\`             | Controls the size variant of the input.                   |
| \`placeholder\` | \`string\`                    | \`"Select profile..."\` | Placeholder text when no profile is selected.           |
| \`hasError\`    | \`boolean\`                   | \`false\`             | Indicates whether the input field is in an error state.   |
| \`errorMessage\`| \`string\`                    | \`-\`                 | The error message displayed when \`hasError\` is true.    |
| \`helperText\`  | \`string\`                    | \`-\`                 | Additional helper text displayed below the input field.   |
| \`profiles\`    | \`Profile[]\`                 | \`[]\`                | Array of profile objects to display in the dropdown.      |

### Profile Object Structure

\`\`\`typescript
{
  label: string;           // Display name
  value: string;           // Unique identifier
  secondaryInfo?: string;  // Additional info (e.g., game name)
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
}
\`\`\`

### Usage Notes

- **Must be wrapped in a React Hook Form FormProvider**
- The dropdown automatically matches the width of the trigger button
- Selected profile displays with UserProfile component
- Unselected state shows placeholder with empty avatar
- Check icon appears next to selected option in dropdown
- Type "profile" should be used with isLarge for medium avatars, while type "driver" uses tiny avatars

### Accessibility

- Full keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Focus management handled by Radix UI
- Proper ARIA attributes for screen readers
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Mock Profile Data -- //

const mockProfiles = [
  {
    label: "JohnDoe",
    value: "john_doe",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "blue",
    },
    secondaryInfo: "Gran Turismo 7",
  },
  {
    label: "JaneSmith",
    value: "jane_smith",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "red",
    },
    secondaryInfo: "F1 24",
  },
  {
    label: "TomJohnson",
    value: "tom_johnson",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "green",
    },
    secondaryInfo: "iRacing",
  },
  {
    label: "AliceWilliams",
    value: "alice_williams",
    avatar: {
      avatarType: "preset" as const,
      avatarValue: "yellow",
    },
    secondaryInfo: "Assetto Corsa",
  },
];

// -- Stories -- //

type Story = StoryObj<typeof ProfileSelectInput>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "416px" }}>
      <FormProviderMock>
        <ProfileSelectInput {...args} />
      </FormProviderMock>
    </div>
  ),
};
Default.args = {
  name: "profile",
  type: "driver",
  fieldLabel: "Select Profile",
  profiles: mockProfiles,
  placeholder: "Select profile...",
};

export const LargeVariant: Story = {
  render: (args) => (
    <div style={{ width: "416px" }}>
      <FormProviderMock>
        <ProfileSelectInput {...args} />
      </FormProviderMock>
    </div>
  ),
};
LargeVariant.args = {
  name: "profile",
  type: "profile",
  fieldLabel: "Select Profile",
  isLarge: true,
  profiles: mockProfiles,
};

export const WithHelperText: Story = {
  render: (args) => (
    <div style={{ width: "416px" }}>
      <FormProviderMock>
        <ProfileSelectInput {...args} />
      </FormProviderMock>
    </div>
  ),
};
WithHelperText.args = {
  name: "profile",
  type: "driver",
  fieldLabel: "Select Profile",
  profiles: mockProfiles,
  helperText: "Choose the profile you want to use for this league",
};

export const WithError: Story = {
  render: (args) => (
    <div style={{ width: "416px" }}>
      <FormProviderMock>
        <ProfileSelectInput {...args} />
      </FormProviderMock>
    </div>
  ),
};
WithError.args = {
  name: "profile",
  type: "profile",
  fieldLabel: "Select Profile",
  profiles: mockProfiles,
  isLarge: true,
  hasError: true,
  errorMessage: "Please select a profile to continue",
};