import { useFormContext } from "react-hook-form";
import { getAvatarVariants } from "@/components/Avatar/Avatar.variants";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { getCoverVariants } from "@/components/Structures/Cover/Cover.variants";
import { primaryThemeTokens, type Theme } from "@/app/design/tokens/theme";
import { AVATAR_VARIANTS } from "@/types/profile.types";
import { LEAGUE_COVER_VARIANTS, type CoverImageValue, type LeagueCover } from "@/types/league.types";
import { SQUAD_BANNER_VARIANTS, type BannerImageValue, type SquadBanner } from "@/types/squad.types";
import GraphicOption from "./GraphicOption/GraphicOption";
import {
  HelperText,
  Label,
  OptionsContainer,
  SelectGraphicInputContainer,
} from "./SelectGraphicInput.styles";
import type { AvatarFormValues } from "@/features/profiles/forms/Create/Avatar/avatarFormSchema";

type GraphicInputFormValues = {
  avatar?: AvatarFormValues["avatar"];
  banner?: BannerImageValue;
  cover?: CoverImageValue;
  themeColor?: Theme;
};

type Props = {
  name: "avatar" | "banner" | "cover" | "themeColor";
  label: string;
  helperText?: string;
};

const SelectGraphicInput = ({ name, label, helperText }: Props) => {
  const { watch, setValue } = useFormContext<GraphicInputFormValues>();
  const current = watch(name);

  const avatars = Object.entries(getAvatarVariants()).filter(
    ([key]) => key !== "none" && key !== "email",
  );

  const badges = Object.entries(getBannerVariants());
  const covers = Object.entries(getCoverVariants());
  const themeColors = Object.entries(primaryThemeTokens);

  const options =
    name === "banner"
      ? badges
      : name === "cover"
        ? covers
        : name === "themeColor"
          ? themeColors
          : avatars;

  // Handle selection of a graphic option
  // When an option is selected, we update the form state with either a preset selection or an upload type
  const handleSelect = (variant: string) => {
    if (name === "banner") {
      setValue(
        "banner",
        {
          type: "preset",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variant: SQUAD_BANNER_VARIANTS.includes(variant as any)
            ? (variant as SquadBanner)
            : SQUAD_BANNER_VARIANTS[0],
        },
        { shouldDirty: true, shouldValidate: true },
      );
    } else if (name === "cover") {
      setValue(
        "cover",
        {
          type: "preset",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variant: LEAGUE_COVER_VARIANTS.includes(variant as any)
            ? (variant as LeagueCover)
            : LEAGUE_COVER_VARIANTS[0],
        },
        { shouldDirty: true, shouldValidate: true },
      );
    } else if (name === "themeColor") {
      setValue(
        "themeColor",
        variant as Theme,
        { shouldDirty: true, shouldValidate: true },
      );
    } else {
      setValue(
        "avatar",
        {
          type: "preset",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          variant: AVATAR_VARIANTS.includes(variant as any)
            ? (variant as typeof AVATAR_VARIANTS[number])
            : AVATAR_VARIANTS[0],
        },
        { shouldDirty: true, shouldValidate: true },
      );
    }
  };

  const isOptionSelected = (variant: string): boolean => {
    if (name === "themeColor") return current === variant;
    // If current value is not preset or doesn't match the expected structure, treat as no selection
    if (!current || typeof current !== "object" || current.type !== "preset") return false;
    if (name === "banner") return (current as Extract<BannerImageValue, { type: "preset" }>).variant === variant;
    if (name === "cover") return (current as Extract<CoverImageValue, { type: "preset" }>).variant === variant;
    return (current as Extract<AvatarFormValues["avatar"], { type: "preset" }>).variant === variant;
  };

  return (
    <SelectGraphicInputContainer>
      <Label>{label}</Label>

      <OptionsContainer>
        {options.map(([variant, data]) => (
          <GraphicOption
            key={variant}
            label={variant}
            graphicSrc={
              typeof data === "string"
                ? data
                : "avatar" in data
                  ? data.avatar
                  : undefined
            }
            swatchColor={
              name === "themeColor" && typeof data !== "string" && "primaryA" in data
                ? data.primaryA
                : undefined
            }
            isSelected={isOptionSelected(variant)}
            onClick={() => handleSelect(variant)}
          />
        ))}
      </OptionsContainer>

      <HelperText>{helperText}</HelperText>
    </SelectGraphicInputContainer>
  );
};

export default SelectGraphicInput;
