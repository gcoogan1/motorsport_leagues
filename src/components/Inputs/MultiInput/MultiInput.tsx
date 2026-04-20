import { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, {
	components,
	type DropdownIndicatorProps,
	type MultiValue,
	type OptionProps,
} from "react-select";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import DropdownIcon from "@assets/Icon/Dropdown.svg?react";
import CheckIcon from "@assets/Icon/Check.svg?react";
import { getTagVariants, type Tag } from "@/components/Tags/Tags.variants";
import { useAppTheme } from "@/providers/theme/useTheme";
import Icon from "@/components/Icon/Icon";
import {
	ErrorText,
	FieldWrapper,
	HelperText,
	Label,
	MultiInputMenuGlobalStyles,
	OptionContent,
	OptionLabel,
	OptionRow,
} from "./MultiInput.styles";

type TagOption = {
	value: Tag;
	label: string;
};

type MultiInputProps = {
	name?: string;
	label?: string;
	helperText?: string;
	placeholder?: string;
	options?: TagOption[];
	onChange?: (selectedTags: Tag[]) => void;
};

const DropdownIndicator = (props: DropdownIndicatorProps<TagOption, true>) => {
	return (
		<components.DropdownIndicator {...props}>
			<DropdownIcon width={18} height={18} />
		</components.DropdownIndicator>
	);
};

const Option = (props: OptionProps<TagOption, true>) => {
	const { children, innerRef, innerProps, isFocused, isSelected } = props;

	return (
		<components.Option {...props}>
			<OptionRow
				ref={innerRef}
				{...innerProps}
				$isFocused={isFocused}
				$isSelected={isSelected}
			>
				<OptionContent>
					<OptionLabel>{children}</OptionLabel>
				</OptionContent>
				{isSelected && (
					<Icon size="small">
						<CheckIcon />
					</Icon>
				)}
			</OptionRow>
		</components.Option>
	);
};

const MultiInput = ({
	name = "multiInput",
	label,
	helperText,
	placeholder = "Select tags",
	options,
	onChange,
}: MultiInputProps) => {
	const inputId = useId();
	const { themeName } = useAppTheme();
	const { control, trigger } = useFormContext();

	const tagOptions: TagOption[] =
		options ??
		getTagVariants(themeName).map((tag) => ({
			value: tag.name as Tag,
			label: tag.label,
		}));

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={[]}
			render={({ field: { onChange: onFieldChange, value, ref }, fieldState: { error } }) => {
				const selectedTags = Array.isArray(value) ? (value as Tag[]) : [];
				const selectedOptions = tagOptions.filter((option) =>
					selectedTags.includes(option.value),
				);

				return (
					<FieldWrapper>
						<MultiInputMenuGlobalStyles />
						{label && <Label htmlFor={inputId}>{label}</Label>}
						<Select<TagOption, true>
							isMulti
							isClearable={false}
							unstyled
							classNamePrefix="select"
							ref={ref}
							inputId={inputId}
							value={selectedOptions}
							options={tagOptions}
							hideSelectedOptions={false}
							closeMenuOnSelect={false}
							menuPlacement="bottom"
							menuShouldScrollIntoView={false}
							captureMenuScroll={false}
							menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
							menuPosition="fixed"
							placeholder={selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
							noOptionsMessage={() => "No tags found"}
							onChange={(selected) => {
								const nextSelected = ((selected as MultiValue<TagOption>) ?? []).map(
									(option) => option.value,
								);

								onFieldChange(nextSelected);
								onChange?.(nextSelected);
								void trigger(name);
							}}
							classNames={{
								control: () => (error ? "select__control--has-error" : ""),
							}}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 }),
							}}
							components={{
								ClearIndicator: () => null,
								DropdownIndicator,
								IndicatorSeparator: () => null,
								Option,
							}}
						/>
						{helperText && <HelperText>{helperText}</HelperText>}
						{error && (
							<ErrorText>
								<Error_Outlined width={18} height={18} />
								{error.message}
							</ErrorText>
						)}
					</FieldWrapper>
				);
			}}
		/>
	);
};

export default MultiInput;
