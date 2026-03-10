import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
import {
  HelperText,
  InputField,
  InputWrapper,
  Label,
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
  label: string;
  helperText?: string;
  profile: User;
};

const ReadOnlyInput = ({ label, helperText, profile }: ReadOnlyInputProps) => {
  return (
    <InputWrapper>
      <Label>{label}</Label>
      <InputField>
        <UserProfile
          username={profile.username}
          avatarType={profile.avatarType}
          avatarValue={profile.avatarValue}
          information={profile.information}
          size="medium"
          tags={profile.tags}
        />
      </InputField>
      {helperText && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};

export default ReadOnlyInput;
