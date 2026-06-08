export const getLabelFromOptions = (
  options: Array<{ label: string; value: string }>,
  value: unknown,
): string => {
  if (value === undefined || value === null || value === "") {
    return "Not Set";
  }

  const stringValue = String(value);
  return options.find((option) => option.value === stringValue)?.label ??
    stringValue;
};

export const parseStringArrayField = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((entry): entry is string =>
          typeof entry === "string"
        );
      }
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
};

export const formatValue = (value: unknown): string => {
  if (value === undefined || value === null || value === "") {
    return "Not Set";
  }

  if (typeof value === "boolean") {
    return value ? "On" : "Off";
  }

  return String(value);
};
