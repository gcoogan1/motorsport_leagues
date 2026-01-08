/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/react";
import { MockAuthProvider } from "@/providers/mock/MockAuthProvider";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import CreateAccount from "./CreateAccount";
import { MemoryRouter } from "react-router";

// -- Meta Configuration -- //

const meta: Meta<typeof CreateAccount> = {
  title: "Pages/Auth/CreateAccount",
  component: CreateAccount,
  decorators: [withAppTheme],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
The **CreateAccount** page handles user registration and email verification.

### Features

**Signup Form**: Displays a form for new users to create an account.

 **Email Verification**: Prompts users to verify their email address after account creation.

### User States

**Guest User**: The \`SignupForm\` is displayed for users to create a new account.

**Email Verification**: The \`VerifyEmail\` form is displayed to prompt for email verification.

**Verified User**: Represents a user who has successfully verified their email address. In this state, the component would typically redirect to the homepage or dashboard. **NOT shown in this story.**


### Usage Notes

The CreateAccount component utilizes the \`MockAuthProvider\` to simulate authentication states for testing and demonstration purposes.

Different modals will appear based on user actions, such as successful account creation or errors during the signup process. **NOT shown in this story.**
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

// -- Stories -- //

// Note: stories are wrapped in MemoryRouter to provide routing context and MockAuthProvider to simulate different authentication states.

type Story = StoryObj<typeof CreateAccount>;

export const SignupForm: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/create-account"]}>
      <MockAuthProvider
        value={{
          user: null,
          session: null,
          isVerified: false,
          loading: false,
          refreshAuth: async () => {},
        }}
      >
        <CreateAccount />
      </MockAuthProvider>
    </MemoryRouter>
  ),
};

export const VerificationCode: Story = {
  render: () => (
    <MemoryRouter initialEntries={["/create-account"]}>
      <MockAuthProvider
        value={{
          user: {
            id: "123",
            email: "user@test.com",
          } as any,
          session: {} as any,
          isVerified: false,
          loading: false,
          refreshAuth: async () => {},
        }}
      >
        <CreateAccount />
      </MockAuthProvider>
    </MemoryRouter>
  ),
};
