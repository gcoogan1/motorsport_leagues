/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Button from "../../Button/Button";
import {
  FormWrapper,
  FormHeader,
  HeaderTitle,
  FormBody,
  BodyHeader,
  BodyTitle,
  BodySubtitle,
  BodyInputContainer,
  FormActions,
  SecondaryButtonContainer,
} from "./FormBlock.styles";

type FormBlockProps = {
  title: string;
  question: string;
  helperMessage?: string;
  children?: React.ReactNode;
  buttons?: {
    onCancel?: {
      label: string;
      action?: () => void;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
    onContinue?: {
      label: string;
      action?: () => void;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
  };
  onSubmit?: (data: any) => void;
};

const FormBlock = ({
  title,
  question,
  helperMessage,
  children,
  buttons,
  onSubmit,
}: FormBlockProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  const handleOnContinue = () => {
    if (buttons?.onContinue?.action) {
      buttons.onContinue.action();
    }
  };

  const handleOnCancel = () => {
    if (buttons?.onCancel?.action) {
      buttons.onCancel.action();
    }
  };

  return (
    <FormWrapper onSubmit={onSubmit}>
      <FormHeader>
        <HeaderTitle>{title}</HeaderTitle>
      </FormHeader>
      <FormBody $isMobile={isMobile}>
        <BodyHeader>
          <BodyTitle>{question}</BodyTitle>
          <BodySubtitle>{helperMessage}</BodySubtitle>
        </BodyHeader>
        <BodyInputContainer>{children}</BodyInputContainer>
      </FormBody>
      <FormActions>
        <SecondaryButtonContainer>
        {buttons?.onCancel && (
            <Button
              color="base"
              variant="ghost"
              onClick={handleOnCancel}
              isLoading={buttons?.onCancel?.loading}
              loadingText={buttons?.onCancel?.loadingText}
              icon={{
                left: buttons?.onCancel?.leftIcon,
                right: buttons?.onCancel?.rightIcon,
              }}
            >
              {buttons?.onCancel?.label || "Cancel"}
            </Button>
        )}
        </SecondaryButtonContainer>
        {buttons?.onContinue && (
          <Button
            type="submit"
            color="system"
            onClick={handleOnContinue}
            isLoading={buttons?.onContinue?.loading}
            loadingText={buttons?.onContinue?.loadingText}
            icon={{
              left: buttons?.onContinue?.leftIcon,
              right: buttons?.onContinue?.rightIcon,
            }}
          >
            {buttons?.onContinue?.label || "Continue"}
          </Button>
        )}
      </FormActions>
    </FormWrapper>
  );
};

export default FormBlock;
