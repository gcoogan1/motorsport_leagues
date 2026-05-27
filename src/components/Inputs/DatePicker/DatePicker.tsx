/* eslint-disable react-hooks/purity */
import { useRef, useState, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DayPicker, type NavProps } from "react-day-picker";
import { format } from "date-fns";
import ChevRight from "@assets/Icon/Chevron_Right.svg?react";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import DateIcon from "@assets/Icon/Date.svg?react";
import {
  CalendarContainer,
  CalendarPopover,
  DateInput,
  DateInputWrapper,
  ErrorText,
  HelperText,
  IconButton,
  Label,
  LabelRow,
} from "./DatePicker.styles";

import "react-day-picker/dist/style.css";
import Button from "@/components/Button/Button";

type Props = {
  name: string;
  label: string;
  helperText?: string;
  error?: string;
};

const DatePicker = ({ name, label, helperText, error }: Props) => {
  const { setValue, watch } = useFormContext();
  const selectedDate = watch(name);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const labelId = useRef(
    `datepicker-label-${Math.random().toString(36).slice(2)}`,
  );
  const inputId = useRef(
    `datepicker-input-${Math.random().toString(36).slice(2)}`,
  );

  const openCalendar = useCallback(() => setOpen(true), []);
  const closeCalendar = useCallback(() => {
    setOpen(false);
    inputRef.current?.focus();
  }, []);
  const toggleCalendar = useCallback(() => setOpen((prev) => !prev), []);

  // Close on Escape, and trap focus within popover
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCalendar();
      }
    };

    // Close when focus leaves the entire component
    const handleFocusOut = (e: FocusEvent) => {
      if (
        containerNode &&
        !containerNode.contains(e.relatedTarget as Node)
      ) {
        setOpen(false);
      }
    };

    const containerNode = containerRef.current;
    document.addEventListener("keydown", handleKeyDown);
    containerNode?.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      containerNode?.removeEventListener("focusout", handleFocusOut);
    };
  }, [open, closeCalendar]);

  // Move focus into the popover when it opens
  useEffect(() => {
    if (open && popoverRef.current) {
      // Focus the first focusable day button inside the calendar
      const firstFocusable = popoverRef.current.querySelector<HTMLElement>(
        'button:not([disabled]), [tabindex="0"]',
      );
      firstFocusable?.focus();
    }
  }, [open]);

  // -- Custom Navigation Component -- //

  const CustomNav = ({ onPreviousClick, onNextClick }: NavProps) => (
    <div className="custom-nav" role="group" aria-label="Navigate months">
      <Button
        size="small"
        color="system"
        variant="ghost"
        aria-label="Previous month"
        onClick={(e) => onPreviousClick?.(e)}
        icon={{ left: <ChevRight style={{ rotate: "-180deg" }} /> }}
      />
      <Button
        size="small"
        color="system"
        variant="ghost"
        aria-label="Next month"
        onClick={(e) => onNextClick?.(e)}
        icon={{ right: <ChevRight /> }}
      />
    </div>
  );

  // -- Handlers -- //

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCalendar();
    } else if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      openCalendar();
    }
  };

  const handleIconKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCalendar();
    }
  };

  return (
    <CalendarContainer ref={containerRef}>
        <LabelRow>
          <Label id={labelId.current} htmlFor={inputId.current}>
            {label}
          </Label>
        </LabelRow>

      <DateInputWrapper $focused={open} $hasError={!!error}>
        <DateInput
          ref={inputRef}
          id={inputId.current}
          readOnly
          aria-readonly="true"
          aria-label={label ?? "Select date"}
          aria-labelledby={label ? labelId.current : undefined}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-invalid={!!error}
          aria-describedby={
            error || helperText ? `${inputId.current}-helper` : undefined
          }
          role="combobox"
          tabIndex={0}
          value={selectedDate ? format(selectedDate, "dd MMM, yyyy") : ""}
          placeholder="30 Dec, 2030"
          onClick={toggleCalendar}
          onKeyDown={handleInputKeyDown}
        />

        <IconButton
          type="button"
          aria-label={open ? "Close calendar" : "Open calendar"}
          aria-expanded={open}
          aria-controls={`${inputId.current}-popover`}
          tabIndex={-1} // Input is the primary focus target; icon is supplementary
          onClick={toggleCalendar}
          onKeyDown={handleIconKeyDown}
        >
          <DateIcon width={20} height={20} />
        </IconButton>
      </DateInputWrapper>

      {(helperText) && (
        <HelperText
          id={`${inputId.current}-helper`}
          role={error ? "alert" : undefined}
          aria-live={error ? "polite" : undefined}
        >
          {helperText}
        </HelperText>
      )}
      {error && (
        <ErrorText
          id={`${inputId.current}-helper`}
          role="alert"
          aria-live="polite"
        >
          <Error_Outlined width={18} height={18} />
          {error}
        </ErrorText>
      )}

      {open && (
        <CalendarPopover
          ref={popoverRef}
          id={`${inputId.current}-popover`}
          role="dialog"
          aria-modal="true"
          aria-label="Date picker calendar"
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setValue(name, date);
              setOpen(false);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            components={{ Nav: CustomNav }}
            showOutsideDays
            classNames={{
              months: "rdp-months",
              month: "rdp-month",
              month_caption: "rdp-caption",
              nav: "rdp-nav",
              weekdays: "rdp-weekdays",
              weekday: "rdp-weekday",
              week: "rdp-week",
              day: "rdp-day",
              selected: "rdp-day_selected",
              today: "rdp-day_today",
              outside: "rdp-day_outside",
            }}
          />
        </CalendarPopover>
      )}
    </CalendarContainer>
  );
};

export default DatePicker;
