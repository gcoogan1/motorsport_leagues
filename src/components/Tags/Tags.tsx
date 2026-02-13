import { getTagVariants, type Tag, type TagVariant } from "./Tags.variants";
import { useAppTheme } from "@/providers/theme/useTheme";
import { TagItem, TagsContainer } from "./Tags.styles";

type TagProps = {
  variants: Tag[];
}

const Tags = ({ variants }: TagProps) => {
  const { themeName } = useAppTheme();
  const tagVariants: TagVariant[] = getTagVariants(themeName);
  
  const renderedTags = variants.map((variant) => {
    const tagVariant = tagVariants.find((v) => v.name === variant);

    if (!tagVariant) return null;

    return (
      <TagItem key={variant} $variant={tagVariant}>
        {tagVariant.label}
      </TagItem>
    );
  });

  return (
    <TagsContainer>
      {renderedTags}
    </TagsContainer>
  )
}

export default Tags