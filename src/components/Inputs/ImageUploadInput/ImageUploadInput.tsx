import { useRef, useState } from "react";
import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";
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
  UploadContainer,
} from "./ImageUploadInput.styles";

//TODO: Add IMG or Avatar to global state (save in backend)

type ImageUploadInputProps = {
  isAvatar?: boolean;
  avatarType?: AvatarVariants;
  helperMessage?: string;
  hasError?: boolean;
  errorMessage?: string;
  onChange?: (file: File) => void;
};

const ImageUploadInput = ({
  isAvatar,
  avatarType,
  helperMessage,
  hasError,
  errorMessage,
  onChange,
}: ImageUploadInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fileName, setFileName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  // Handle file input change and preview
  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    file: File,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
      if (onChange) {
        onChange(file);
      }
    }
  };

  return (
    <InputContainer>
      <ImageUploadContainer>
        {isAvatar ? (
          <Avatar type={avatarType!} imageUrl={imageUrl} />
        ) : (
          <ImageUpload>
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded preview" />
            ) : null}
          </ImageUpload>
        )}
        <UploadContainer>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleOnChange(e, e.target.files![0])}
          />
          <Button
            size="small"
            color="base"
            icon={{
              left: <UploadIcon />,
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Image
          </Button>
          <HelperMessage>{helperMessage}</HelperMessage>
        </UploadContainer>
      </ImageUploadContainer>
      {hasError && (
        <ErrorText>
          <Error_Outlined width={18} height={18} /> {errorMessage}
        </ErrorText>
      )}
    </InputContainer>
  );
};

export default ImageUploadInput;
