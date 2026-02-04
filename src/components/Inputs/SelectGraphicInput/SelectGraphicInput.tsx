import { useFormContext } from "react-hook-form";
import { getAvatarVariants } from "@/components/Avatar/Avatar.variants";
import { AVATAR_VARIANTS } from "@/types/profile.types";
import GraphicOption from "./GraphicOption/GraphicOption";
import {
  HelperText,
  Label,
  OptionsContainer,
  SelectGraphicInputContainer,
} from "./SelectGraphicInput.styles";
import type { AvatarFormValues } from "@/features/profiles/forms/Create/Avatar/avatarFormSchema";


type Props = {
  name: "avatar";
  label: string;
  helperText?: string;
};

const SelectGraphicInput = ({ name, label, helperText }: Props) => {
  // React Hook Form context
  const { watch, setValue } = useFormContext<AvatarFormValues>();
  const current = watch(name);

  // Get avatar variants excluding "none" and "email"
  const avatars= Object.entries(getAvatarVariants()).filter(
    ([key]) => key !== "none" && key !== "email",
  );

  return (
    <SelectGraphicInputContainer>
      <Label>{label}</Label>

      <OptionsContainer>
        {avatars.map(([variant, data]) => (
          <GraphicOption
            key={variant}
            graphicSrc={data.avatar!}
            isSelected={current?.type === "preset" && current.variant === variant}
            onClick={() =>
              setValue(name, {
                type: "preset",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variant: AVATAR_VARIANTS.includes(variant as any)
                  ? (variant as typeof AVATAR_VARIANTS[number]) // AVATAR_VARIANTS do not include "none" or "email", so this cast is safe
                  : AVATAR_VARIANTS[0], // Fallback to first variant if not found
              })
            }
          />
        ))}
      </OptionsContainer>

      <HelperText>{helperText}</HelperText>
    </SelectGraphicInputContainer>
  );
};

export default SelectGraphicInput;
