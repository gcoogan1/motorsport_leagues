import React from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  onContinue?: () => void;
  onCancel?: () => void;
};

const FormBlock = ({
  title,
  question,
  helperMessage,
  children,
  onContinue,
  onCancel,
}: FormBlockProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const handleOnContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };

  const handleOnCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormWrapper onSubmit={handleSubmit(handleOnContinue)}>
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
            <Button color="base" variant="ghost" onClick={handleOnCancel}>
              Cancel
            </Button>
          </SecondaryButtonContainer>
          <Button type="submit" color="system">
            Continue
          </Button>
        </FormActions>
      </FormWrapper>
    </FormProvider>
  );
};

export default FormBlock;
