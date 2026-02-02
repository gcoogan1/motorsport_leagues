import { useState } from "react"
import { getAvatarVariants } from "@/components/Avatar/Avatar.variants"
import GraphicOption from "./GraphicOption/GraphicOption"
import { HelperText, Label, OptionsContainer, SelectGraphicInputContainer } from "./SelectGraphicInput.styles"

type SelectGraphicInputProps = {
  label: string;
  helperText?: string;
  defaultSelected?: string;
}

const SelectGraphicInput = ({ label, helperText, defaultSelected }: SelectGraphicInputProps) => {
  const [isSelected, setIsSelected] = useState<string | null>(defaultSelected || null)
  const avatars = getAvatarVariants()

  const getAvatarImages = () => {
    return Object.entries(avatars)
      .filter(([key]) => key !== "none" &&  key !== "email")
      .map(([key, value]) => ({
        variant: key,
        avatar: value.avatar,
      }))
  }
  const avatarImages = getAvatarImages()

  return (
    <SelectGraphicInputContainer>
      <Label>{label}</Label>
      <OptionsContainer>
        {avatarImages.map(({ variant, avatar }) => (
          <GraphicOption
            key={variant}
            isSelected={isSelected === variant}
            onClick={() => setIsSelected(variant)}
            graphicSrc={avatar!}
          />
        ))}
      </OptionsContainer>
      <HelperText>{helperText}</HelperText>
    </SelectGraphicInputContainer>
  )
}

export default SelectGraphicInput