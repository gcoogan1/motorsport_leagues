import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch";
import { HelperMessage, Label, TextContainer, ToggleContainer } from "./Toggle.styles";

export type ToggleOption = {
	name?: string;
	label: string;
	isOn?: boolean;
	defaultOn?: boolean;
	helperMessage?: string;
	disabled?: boolean;
	onChange?: (isOn: boolean) => void;
};

type ToggleProps = ToggleOption;

const Toggle = ({
	name,
	label,
	isOn,
	defaultOn,
	helperMessage,
	disabled = false,
	onChange,
}: ToggleProps) => {
	const [internalOn, setInternalOn] = useState(defaultOn ?? false);

	const currentOn = isOn ?? internalOn;

	const handleToggle = (next: boolean) => {
		if (isOn === undefined) {
			setInternalOn(next);
		}
		onChange?.(next);
	};

	return (
		<ToggleContainer>
			<ToggleSwitch
				isOn={currentOn}
				disabled={disabled}
				onChange={handleToggle}
				ariaLabel={label}
			/>
			{name && (
				<input type="hidden" name={name} value={currentOn ? "true" : "false"} readOnly />
			)}
			<TextContainer>
				<Label onClick={() => !disabled && handleToggle(!currentOn)}>{label}</Label>
				{helperMessage && <HelperMessage>{helperMessage}</HelperMessage>}
			</TextContainer>
		</ToggleContainer>
	);
};

export default Toggle;
