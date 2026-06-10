import { useEffect, useState } from "react";
import MinusIcon from "@assets/Icon/Minus.svg?react";
import AddIcon from "@assets/Icon/Add.svg?react";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  ButtonGroup,
  ErrorText,
  HelperText,
  InputContainer,
  InputWrapper,
  Label,
  LabelRow,
  NumberInputWrapper,
  NumberInput,
  NumberValue,
} from "./IncrementInput.styles";
import Button from "@/components/Button/Button";

type IncrementInputProps = {
  label: string;
  value?: number;
  name?: string;
  min?: number;
  max?: number;
  step?: number; // The amount to increment or decrement the value by
  clampOnBlur?: boolean;
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
  style?: React.CSSProperties;
  onChange?: (value: number) => void;
  formatter?: (value: number) => string
};

const IncrementInput = ({
  label,
  value = 0,
  name,
  min = 0,
  max = 99,
  step = 1,
  clampOnBlur = true,
  helperText,
  style,
  hasError = false,
  errorMessage,
  onChange,
  formatter = (value) => String(value)
}: IncrementInputProps) => {
  const [inputValue, setInputValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const parsedInputValue = Number(inputValue);
  const currentNumber = Number.isFinite(parsedInputValue)
    ? parsedInputValue
    : min;
  const hasValue = currentNumber > -1;

  const handleIncrement = () => {
    const nextValue = currentNumber + step;
    const newValue = clampOnBlur ? Math.min(nextValue, max) : nextValue;
    setInputValue(String(newValue));
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const nextValue = currentNumber - step;
    const newValue = clampOnBlur ? Math.max(nextValue, min) : nextValue;
    setInputValue(String(newValue));
    onChange?.(newValue);
  };


  return (
    <InputWrapper $hasValue={hasValue} style={style}>
      <LabelRow>
        {label && <Label>{label}</Label>}
      </LabelRow>

      <InputContainer
        $hasError={hasError}
        $hasValue={hasValue}
      >
        <ButtonGroup>
          <Button
            type="button"
            size="small"
            color="base"
            onClick={handleDecrement}
            aria-label="Decrease value"
            icon={{ left: <MinusIcon /> }}
          />
        </ButtonGroup>

        {/* Value can either be typed directly or adjusted using the buttons */}
        <NumberInputWrapper>
          <NumberInput
            name={name}
            type="number"
            value={inputValue}
            min={min}
            max={max}
            step={step}
            $hasValue={hasValue}
            $isFocused={isFocused}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);

              const parsedValue = Number(inputValue);
              if (!Number.isFinite(parsedValue)) {
                setInputValue(String(min));
                onChange?.(min);
                return;
              }

              const resolvedValue = clampOnBlur
                ? Math.min(Math.max(parsedValue, min), max)
                : parsedValue;
              setInputValue(String(resolvedValue));
              onChange?.(resolvedValue);
            }}
            onChange={(e) => {
              const nextValue = e.target.value;
              setInputValue(nextValue);

              const numericValue = Number(nextValue);
              if (Number.isFinite(numericValue)) {
                onChange?.(numericValue);
              }
            }}
          />
          {!isFocused && (
            <NumberValue $hasValue={hasValue}>{formatter(currentNumber)}</NumberValue>
          )}
        </NumberInputWrapper>

        <ButtonGroup>
          <Button
            type="button"
            size="small"
            color="base"
            onClick={handleIncrement}
            aria-label="Increase value"
            icon={{ left: <AddIcon /> }}
          />
        </ButtonGroup>
      </InputContainer>

      {helperText && (
        <HelperText>{helperText}</HelperText>
      )}

      {hasError && errorMessage && (
        <ErrorText>
          <Error_Outlined />
          {errorMessage}
        </ErrorText>
      )}
    </InputWrapper>
  );
};

export default IncrementInput;