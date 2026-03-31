import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import { FormProviderMock } from "@/providers/mock/FormProviderMock";
import SquadSelectInput from "./SquadSelectInput";

// -- Meta Configuration -- //

const meta: Meta<typeof SquadSelectInput> = {
	title: "Components/Inputs/SquadSelectInput",
	decorators: [withAppTheme],
	component: SquadSelectInput,
	argTypes: {
		name: {
			control: "text",
		},
		fieldLabel: {
			control: "text",
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
		squads: {
			control: false,
		},
	},
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
The **SquadSelectInput** component is a custom dropdown input for selecting squads.
It integrates with React Hook Form and renders squad banners in both the trigger and dropdown options.

### Features

- **Banner Support**: Renders preset squad banners or empty state
- **Custom Dropdown**: Uses MenuDropdown with Radix Select primitives
- **React Hook Form Integration**: Controlled through form context
- **Validation Ready**: Supports helper and error message states

### Usage Notes

- **Must be wrapped in a React Hook Form FormProvider**
- The input width is controlled by its parent container
- The selected option appears in the trigger with its banner
				`,
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;

// -- Mock Squad Data -- //

const mockSquads = [
	{
		label: "Redline Racers",
		value: "redline_racers",
		banner: { type: "preset" as const, variant: "badge1" as const },
	},
	{
		label: "Apex Crew",
		value: "apex_crew",
		banner: { type: "preset" as const, variant: "badge2" as const },
	},
	{
		label: "Night Shift",
		value: "night_shift",
		banner: "none" as const,
	},
];

// -- Stories -- //

type Story = StoryObj<typeof SquadSelectInput>;

export const Default: Story = {
	render: (args) => (
		<div style={{ width: "416px" }}>
			<FormProviderMock>
				<SquadSelectInput {...args} />
			</FormProviderMock>
		</div>
	),
};
Default.args = {
	name: "squad",
	fieldLabel: "Select Squad",
	placeholder: "Choose a squad...",
	squads: mockSquads,
};

export const WithHelperText: Story = {
	render: (args) => (
		<div style={{ width: "416px" }}>
			<FormProviderMock>
				<SquadSelectInput {...args} />
			</FormProviderMock>
		</div>
	),
};
WithHelperText.args = {
	name: "squad",
	fieldLabel: "Select Squad",
	squads: mockSquads,
	helperText: "Choose which squad to continue with",
};

export const WithError: Story = {
	render: (args) => (
		<div style={{ width: "416px" }}>
			<FormProviderMock>
				<SquadSelectInput {...args} />
			</FormProviderMock>
		</div>
	),
};
WithError.args = {
	name: "squad",
	fieldLabel: "Select Squad",
	squads: mockSquads,
	hasError: true,
	errorMessage: "Please select a squad to continue",
};

