import type { Meta, StoryObj } from "@storybook/react";
import { withAppTheme } from "@/app/design/storybook/withAppTheme";
import SegmentedInput from "./SegmentedInput";

// -- Meta Configuration -- //

const meta: Meta<typeof SegmentedInput> = {
	title: "Components/Inputs/SegmentedInput",
	decorators: [withAppTheme],
	component: SegmentedInput,
	argTypes: {
		name: {
			control: "text",
		},
		inputLabel: {
			control: "text",
		},
		options: {
			control: "object",
		},
		value: {
			control: "text",
		},
		defaultValue: {
			control: "text",
		},
		onChange: {
			action: "changed",
			control: false,
		},
		helperMessage: {
			control: "text",
		},
	},
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
The **SegmentedInput** component renders a compact group of selectable options, where only one option can be selected at a time.

### Features

- **Single selection**: Exactly one option is active at a time.
- **Controlled or uncontrolled**: Supports both \
\`value\` + \
\`onChange\` and \
\`defaultValue\` usage.
- **Keyboard accessible**: Uses native button semantics for each option.
- **Form compatibility**: Optional hidden input via \
\`name\` for native form submissions.

### Props

| Prop | Type | Description |
|------|------|-------------|
| \
\`name\` | \
\`string\` | Optional hidden input name for native form submissions. |
| \
\`inputLabel\` | \
\`string\` | Label displayed above the segmented options. |
| \
\`options\` | \
\`{ label: string; value: string }[]\` | List of segments to render. |
| \
\`value\` | \
\`string\` | Controlled selected value. |
| \
\`defaultValue\` | \
\`string\` | Initial selected value for uncontrolled usage. |
| \
\`onChange\` | \
\`(value: string) => void\` | Fired when selection changes. |
| \
\`helperMessage\` | \
\`string\` | Optional helper text displayed below options. |
				`,
			},
		},
	},
	tags: ["autodocs"],
};

export default meta;

// -- Mock Data -- //

const tabOptions = [
	{ label: "Profiles", value: "profiles" },
	{ label: "Squads", value: "squads" },
	{ label: "Drivers", value: "drivers" },
];

// -- Stories -- //

type Story = StoryObj<typeof SegmentedInput>;

export const Default: Story = {
	args: {
		name: "tab",
		inputLabel: "Browse by",
		options: tabOptions,
		defaultValue: "profiles",
	},
};

export const WithHelperMessage: Story = {
	args: {
		name: "tab",
		inputLabel: "Browse by",
		options: tabOptions,
		defaultValue: "squads",
		helperMessage: "Select the content type you want to view.",
	},
};
