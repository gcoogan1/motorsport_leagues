import { components, type MenuListProps, type MultiValue, type MultiValueProps, type OptionProps, type ValueContainerProps } from "react-select";
import Avatar from "@/components/Avatar/Avatar";
import Chip from "@/components/Chip/Chip";
import {
  OptionLabel,
  OptionMeta,
  OptionRow,
  OptionText,
} from "./MultiUserInput.styles";
import type { SelectOption } from "./MultiUserInput.types";
import { isValidEmail, MAX_SELECTIONS } from "./MultiUserInput.utils";

type CustomMenuListProps = MenuListProps<SelectOption, true> & {
  blockedEmails?: string[];
  onBlockedEmailAttempt?: (email: string) => void;
};

// This file contains custom renderers for the react-select components used in MultiUserInput.
// Includes:

// - CustomOption: Renders each option in the dropdown, showing avatar, username/email, and game info.
// - CustomMultiValue: Renders the selected values as Chips with avatars.
// - CustomMenuList: Renders the dropdown menu list and includes logic to display the email being typed as an option.
// - CustomValueContainer: Renders the container for selected values and shows an "Add more..." prompt when there are selected values and the input is empty.


export const CustomOption = (props: OptionProps<SelectOption, true>) => {
  const { data, isFocused, isSelected } = props;
  const isEmailOption = data.isEmail || data.__isNew__;
  const optionLabel = isEmailOption ? data.value : data.label;
  const optionMeta = isEmailOption ? "Invite by email" : data.secondaryInfo;

  return (
    <components.Option {...props}>
      <OptionRow $isFocused={isFocused} $isSelected={isSelected}>
        {!!data.avatar && !isEmailOption && (
          <Avatar
            size="small"
            avatarType={data.avatar.avatarType}
            avatarValue={data.avatar.avatarValue}
          />
        )}
        <OptionText>
          <OptionLabel>{optionLabel}</OptionLabel>
          {!!optionMeta && <OptionMeta>{optionMeta}</OptionMeta>}
        </OptionText>
      </OptionRow>
    </components.Option>
  );
};

export const CustomMultiValue = (props: MultiValueProps<SelectOption, true>) => {
  const { data } = props;

  const handleRemove = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!event) return;

    props.removeProps.onMouseDown?.(
      event as unknown as React.MouseEvent<HTMLDivElement>,
    );

    props.removeProps.onClick?.(
      event as unknown as React.MouseEvent<HTMLDivElement>,
    );
  };

  if (data.isEmail) {
    return (
      <Chip
        type="profile"
        onClick={handleRemove}
        profile={{
          avatarType: "preset",
          avatarValue: "email",
          username: data.label,
          game: "Email Address",
        }}
      />
    );
  }

  return (
    <Chip
      type="profile"
      profile={{
        avatarType: data.avatar?.avatarType || "preset",
        avatarValue: data.avatar?.avatarValue || "black",
        username: data.label,
        game: data.secondaryInfo || "",
      }}
      onClick={handleRemove}
    />
  );
};

export const CustomMenuList = (props: CustomMenuListProps) => {
  const { selectProps, children } = props;
  const input = selectProps.inputValue;
  const currentValue = (selectProps.value as MultiValue<SelectOption>) ?? [];
  const isAtLimit = currentValue.length >= MAX_SELECTIONS;
  const blockedEmails = props.blockedEmails ?? [];
  const onBlockedEmailAttempt = props.onBlockedEmailAttempt;
  const normalizedInput = input.trim().toLowerCase();

  const alreadySelected = currentValue.some(
    (item) => item.value.toLowerCase() === input.toLowerCase(),
  );

  const isBlockedEmail = blockedEmails.some(
    (email) => email.toLowerCase() === normalizedInput,
  );

  const showEmailRow = input.length > 0 && !alreadySelected && !isAtLimit;

  return (
    <components.MenuList {...props}>
      {children}
      {showEmailRow && (
        <OptionRow
          $isFocused={false}
          $isSelected={false}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isValidEmail(input)) return;
            if (currentValue.length >= MAX_SELECTIONS) return;
            const newOption: SelectOption = {
              value: input,
              label: input,
              isEmail: true,
            };
            (selectProps.onChange as unknown as (...args: unknown[]) => void)(
              [...currentValue, newOption],
              {
                action: "create-option",
              },
            );
            if (isBlockedEmail) {
              onBlockedEmailAttempt?.(input);
            }
          }}
        >
          <Avatar
            size="small"
            avatarType={"preset"}
            avatarValue={"email"}
          />
          <OptionText>
            <OptionLabel>{input}</OptionLabel>
            <OptionMeta>
              Email Address
            </OptionMeta>
          </OptionText>
        </OptionRow>
      )}
    </components.MenuList>
  );
};

export const CustomValueContainer = (
  props: ValueContainerProps<SelectOption, true>,
) => {
  const { children, hasValue, selectProps } = props;
  const [values, input] = children as [React.ReactNode, React.ReactNode];
  const isAtLimit =
    ((selectProps.value as MultiValue<SelectOption>) ?? []).length >=
    MAX_SELECTIONS;
  const showAddMore = hasValue && !selectProps.inputValue && !isAtLimit;

  return (
    <components.ValueContainer {...props}>
      {values}
      {showAddMore && <span className="select__add-more">Add more...</span>}
      {input}
    </components.ValueContainer>
  );
};
