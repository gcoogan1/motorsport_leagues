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
import type { AvatarFormValues } from "@/features/profiles/forms/Create/Avatar/avatarFormSchema";

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

  const { avatarType, avatarValue } = useMemo<{
    avatarType: "preset" | "upload";
    avatarValue: string;
  }>(() => {
    if (!avatar) return { avatarType: "preset" as const, avatarValue: "black" };

    if (avatar.type === "preset") {
      return {
        avatarType: "preset" as const,
        avatarValue: avatar.variant,
      };
    }

    const previewUrl = URL.createObjectURL(avatar.file);

    return {
      avatarType: "upload" as const,
      avatarValue: previewUrl,
    };
  }, [avatar]);

  // Cleanup blob URLs
  useEffect(() => {
    if (avatarType === "upload" && avatarValue.startsWith("blob:")) {
      return () => URL.revokeObjectURL(avatarValue);
    }
  }, [avatarType, avatarValue]);

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            avatarValue={avatarValue as any}
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
