import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import {
  HelperText,
  InputField,
  InputWrapper,
  Label,
  TextValue,
  RichTextContent,
} from "./ReadOnlyInput.styles";
import UserProfile from "@/components/Users/Profile/UserProfile";
import type { Tag } from "@/components/Tags/Tags.variants";

type User = {
  username: string;
  information?: string;
  size?: "small" | "medium" | "large";
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  tags?: Tag[];
};

type ReadOnlyInputProps = {
  label?: string;
  helperText?: string;
  profile?: User;
  textValue?: string;
  richText?: string;
  centerContent?: boolean;
  fullContent?: boolean;
};

const ReadOnlyInput = ({
  label,
  helperText,
  profile,
  textValue,
  richText,
  centerContent = false,
  fullContent = false,
}: ReadOnlyInputProps) => {
  return (
    <InputWrapper $centerContent={centerContent}>
      {label && <Label>{label}</Label>}
      {richText ? (
        <RichTextContent>
          <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: richText }} />
        </RichTextContent>
      ) : (
        <InputField $centerContent={centerContent}>
          {profile ? (
            <UserProfile
              username={profile.username}
              avatarType={profile.avatarType}
              avatarValue={profile.avatarValue}
              information={profile.information}
              size={profile.size ?? "medium"}
              tags={profile.tags}
              centerContent={centerContent}
            />
          ) : (
            <TextValue $fullContent={fullContent}>{textValue || "No profile available"}</TextValue>
          )}
        </InputField>
      )}
      {helperText && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};

export default ReadOnlyInput;
