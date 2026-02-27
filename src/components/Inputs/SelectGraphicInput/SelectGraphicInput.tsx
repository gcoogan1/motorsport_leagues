import { useFormContext } from "react-hook-form";
import { getAvatarVariants } from "@/components/Avatar/Avatar.variants";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { AVATAR_VARIANTS } from "@/types/profile.types";
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
};

type Props = {
  name: "avatar" | "banner";
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

  const options = name === "banner" ? badges : avatars;

  // Handle selection of a graphic option
  // When an option is selected, we update the form state with either a preset selection or an upload type
  const handleSelect = (variant: string) => {
    if (name === "banner") {
      setValue("banner", {
        type: "preset",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variant: SQUAD_BANNER_VARIANTS.includes(variant as any)
          ? (variant as SquadBanner)
          : SQUAD_BANNER_VARIANTS[0],
      });
    } else {
      setValue("avatar", {
        type: "preset",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variant: AVATAR_VARIANTS.includes(variant as any)
          ? (variant as typeof AVATAR_VARIANTS[number])
          : AVATAR_VARIANTS[0],
      });
    }
  };

  const isOptionSelected = (variant: string): boolean => {
    // If current value is not preset or doesn't match the expected structure, treat as no selection
    if (!current || current.type !== "preset") return false;
    // For banner, compare against banner field; for avatar, compare against variant field
    if (name === "banner") return (current as Extract<BannerImageValue, { type: "preset" }>).variant === variant;
    return (current as Extract<AvatarFormValues["avatar"], { type: "preset" }>).variant === variant;
  };

  return (
    <SelectGraphicInputContainer>
      <Label>{label}</Label>

      <OptionsContainer>
        {options.map(([variant, data]) => (
          <GraphicOption
            key={variant}
            graphicSrc={typeof data === "string" ? data : data.avatar!}
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
