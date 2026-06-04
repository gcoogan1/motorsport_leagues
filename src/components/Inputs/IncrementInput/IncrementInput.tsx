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
  NumberInput,
} from "./IncrementInput.styles";
import Button from "@/components/Button/Button";

type IncrementInputProps = {
  label: string;
  value?: number;
  name?: string;
  min?: number;
  max?: number;
  step?: number; // The amount to increment or decrement the value by
  helperText?: string;
  hasError?: boolean;
  errorMessage?: string;
  onChange?: (value: number) => void;
};

const IncrementInput = ({
  label,
  value = 0,
  name,
  min = 0,
  max = 99,
  step = 1,
  helperText,
  hasError = false,
  errorMessage,
  onChange,
}: IncrementInputProps) => {
  const [count, setCount] = useState(value);

  useEffect(() => {
    setCount(value);
  }, [value]);

  const hasValue = count > 0;

  const handleIncrement = () => {

    const newValue = Math.min(count + step, max);

    setCount(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {

    const newValue = Math.max(count - step, min);

    setCount(newValue);
    onChange?.(newValue);
  };


  return (
    <InputWrapper $hasValue={hasValue}>
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
        <NumberInput
          name={name}
          type="number"
          value={count}
          min={min}
          max={max}
          step={step}
          $hasValue={hasValue}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) {
              setCount(min);
              onChange?.(min);
              return;
            }

            const clamped = Math.min(
              Math.max(value, min),
              max
            );

            setCount(clamped);
            onChange?.(clamped);
          }}
        />

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