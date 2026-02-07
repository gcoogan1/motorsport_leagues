import { useEffect, useMemo, useRef } from "react";
import Button from "@/components/Button/Button";
import Avatar from "@/components/Avatar/Avatar";
import UploadIcon from "@assets/Icon/Upload.svg?react";
import Error_Outlined from "@assets/Icon/Error_Outlined.svg?react";
import {
  ErrorText,
  HelperMessage,
  ImageUpload,
  ImageUploadContainer,
  InputContainer,
  Placeholder,
  UploadContainer,
} from "./ImageUploadInput.styles";
import { useFormContext } from "react-hook-form";
import type { AvatarFormValues } from "@/features/panels/profileEdit/forms/EditAvatar/editAvatar.schema";

type Props = {
  name: "avatar";
  isAvatar?: boolean;
  helperMessage?: string;
  hasError?: boolean;
  errorMessage?: string;
};

const ImageUploadInput = ({
  name,
  isAvatar = false,
  helperMessage,
  hasError,
  errorMessage,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { watch, setValue } = useFormContext<AvatarFormValues>();

  const avatar = watch(name);

  // Compute preview URL safely
  // Note: we allow previewUrl in the form state for existing uploads, but it is not a File and should not be treated as such
  const previewUrl = useMemo(() => {
    if (!avatar) return undefined;
    if (avatar.type === "upload") {
      if (avatar.file && avatar.file instanceof File) {
        return URL.createObjectURL(avatar.file);
      }
      if (avatar.previewUrl && typeof avatar.previewUrl === "string") {
        return avatar.previewUrl;
      }
    }
    return undefined;
  }, [avatar]);

  // Cleanup object URL when component unmounts or when a new file is selected
  useEffect(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  // Avatar display logic:
  // - If avatar type is upload and we have a valid preview URL, use it
  // - Else if avatar type is preset, use the variant to display the correct preset avatar
  // - Else show placeholder (no avatar)
  const avatarType = avatar?.type === "upload" ? "upload" : "preset";
  const avatarValue =
    avatarType === "upload" && previewUrl
      ? previewUrl
      : avatarType === "preset" && avatar?.type === "preset"
        ? avatar.variant ?? "black"
        : undefined;

  // Handle file input change and update form state accordingly
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue(
      name,
      { type: "upload", file },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <InputContainer>
      <ImageUploadContainer>
        {isAvatar ? (
          <Avatar
            size="xLarge"
            avatarType={avatarType}
            avatarValue={avatarValue ?? "black"}
          />
        ) : (
          <ImageUpload>
            {avatarType === "upload" && avatarValue ? (
              <img src={avatarValue} alt="Uploaded preview" />
            ) : (
              <Placeholder />
            )}
          </ImageUpload>
        )}

        <UploadContainer>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <Button
            size="small"
            color="base"
            type="button"
            icon={{ left: <UploadIcon /> }}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Image
          </Button>

          <HelperMessage>{helperMessage}</HelperMessage>
        </UploadContainer>
      </ImageUploadContainer>

      {hasError && (
        <ErrorText>
          <Error_Outlined width={18} height={18} />
          {errorMessage}
        </ErrorText>
      )}
    </InputContainer>
  );
};

export default ImageUploadInput;