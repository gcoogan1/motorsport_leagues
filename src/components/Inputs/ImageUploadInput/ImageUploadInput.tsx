import { useEffect, useMemo, useRef } from "react";
import Button from "@/components/Button/Button";
import Avatar from "@/components/Avatar/Avatar";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { getCoverVariants } from "@/components/Structures/Cover/Cover.variants";
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
import type { CoverImageValue } from "@/types/league.types";
import type { BannerImageValue } from "@/types/squad.types";

type ImageInputFormValues = {
  avatar?: AvatarFormValues["avatar"];
  banner?: BannerImageValue;
  cover?: CoverImageValue;
};

type Props = {
  name: "avatar" | "banner" | "cover";
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
  const { watch, setValue } = useFormContext<ImageInputFormValues>();

  const fieldValue = watch(name);

  // Compute preview URL for uploads
  const previewUrl = useMemo(() => {
    if (!fieldValue || fieldValue.type !== "upload") return undefined;
    if (fieldValue.file instanceof File) return URL.createObjectURL(fieldValue.file);
    if (fieldValue.previewUrl && typeof fieldValue.previewUrl === "string") return fieldValue.previewUrl;
    return undefined;
  }, [fieldValue]);

  // Cleanup object URL on unmount or when a new file is selected
  useEffect(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  // Resolve image src for non-avatar display (upload preview or banner preset)
  const imageSrc = (() => {
    if (!fieldValue) return undefined;
    if (fieldValue.type === "upload") return previewUrl;
    if (name === "banner" && fieldValue.type === "preset") {
      return getBannerVariants()[(fieldValue as Extract<BannerImageValue, { type: "preset" }>).variant];
    }
    if (name === "cover" && fieldValue.type === "preset") {
      return getCoverVariants()[(fieldValue as Extract<CoverImageValue, { type: "preset" }>).variant];
    }
    return undefined;
  })();

  // Avatar display values (only used when isAvatar is true)
  const avatarDisplayType = fieldValue?.type === "upload" ? "upload" : "preset";
  const avatarDisplayValue =
    avatarDisplayType === "upload" && previewUrl
      ? previewUrl
      : avatarDisplayType === "preset" && fieldValue?.type === "preset" && name === "avatar"
        ? (fieldValue as Extract<AvatarFormValues["avatar"], { type: "preset" }>).variant ?? "black"
        : undefined;

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
        {isAvatar && name === "avatar" ? (
          <Avatar
            size="xLarge"
            avatarType={avatarDisplayType}
            avatarValue={avatarDisplayValue ?? "black"}
          />
        ) : (
          <ImageUpload>
            {imageSrc ? (
              <img src={imageSrc} alt="Uploaded preview" />
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
