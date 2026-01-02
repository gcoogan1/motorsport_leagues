import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/Button/Button";
import ModalOverlay from "@/components/ModalOverlay/ModalOverlay";
import {
  FormWrapper,
  FormBody,
  BodyHeader,
  BodyTitle,
  BodySubtitle,
  BodyInputContainer,
  FormActions,
  SecondaryButtonContainer,
} from "./FormModal.styles";

// TODO: Add logic to open and close the modal

type FormModalProps = {
  question: string;
  helperMessage?: string;
  children?: React.ReactNode;
  onContinue?: () => void;
  onCancel?: () => void;
};

const FormModal = ({
  question,
  helperMessage,
  children,
  onContinue,
  onCancel,
}: FormModalProps) => {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const [isOpen, setIsOpen] = useState(true);

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
    <ModalOverlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <FormProvider {...formMethods}>
        <FormWrapper onSubmit={handleSubmit(handleOnContinue)}>
          <FormBody>
            <BodyHeader>
              <BodyTitle>{question}</BodyTitle>
              <BodySubtitle>{helperMessage}</BodySubtitle>
            </BodyHeader>
            <BodyInputContainer>{children} </BodyInputContainer>
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
    </ModalOverlay>
  );
};

export default FormModal;
