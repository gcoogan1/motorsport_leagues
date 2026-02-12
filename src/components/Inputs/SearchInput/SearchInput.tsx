import { useFormContext } from "react-hook-form";
import SearchIcon from "@assets/Icon/Search.svg?react";
import CloseIcon from "@assets/Icon/Close.svg?react";
import {
  ButtonWrapper,
  IconWrapper,
  InputContainer,
  InputField,
  InputWrapper,
} from "./SearchInput.styles";
import Button from "@/components/Button/Button";

type SearchInputProps = {
  name: string;
  placeholder?: string;
};

const SearchInput = ({
  name,
  placeholder,
}: SearchInputProps) => {
  const { register, watch, setValue } = useFormContext();

  const value = watch(name);
  const hasValue = Boolean(value && value.length > 0);

  const handleClear = () => {
    setValue(name, "", { shouldDirty: true });
  };

  return (
    <InputWrapper $hasValue={hasValue}>
      <InputContainer>
        <InputField
          id={name}
          type="text"
          {...register(name)}
          placeholder={placeholder}
          $hasValue={hasValue}
        />
        {hasValue && (
          <ButtonWrapper>
            <Button
              type="button"
              size="small"
              color="base"
              variant="ghost"
              icon={{
                left: <CloseIcon />
              }}
              onClick={handleClear}
            />
          </ButtonWrapper>
        )}

        <IconWrapper $hasValue={hasValue}>
          <SearchIcon />
        </IconWrapper>
      </InputContainer>
    </InputWrapper>
  );
};

export default SearchInput;
