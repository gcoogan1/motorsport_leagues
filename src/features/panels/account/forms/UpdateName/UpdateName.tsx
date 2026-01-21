import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { updateProfileNameThunk } from "@/store/profile/profile.thunks";
import type { AppDispatch } from "@/store";
import type { ProfileTable } from "@/types/profile.types";
import { type UpdateNameSchema, updateNameSchema } from "./updateNameSchema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import NameUpdateFail from "../../modals/errors/NameUpdateFail/NameUpdateFail";

type UpdateNameProps = {
  profile: ProfileTable;
};

const UpdateName = ({ profile }: UpdateNameProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // -- Form setup -- //
  const formMethods = useForm<UpdateNameSchema>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: UpdateNameSchema) => {
    setIsLoading(true);
    try {
      // Update name (thunk)
      const res = await withMinDelay(dispatch(
        updateProfileNameThunk({
          firstName: data.firstName,
          lastName: data.lastName,
          userId: profile.id,
        })
      ).unwrap(), 1000);

      if (!res.success) {
        openModal(<NameUpdateFail />);
      }

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Account Name updated.",
      });
      closeModal();
    } catch {
      openModal(<NameUpdateFail />);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
    closeModal();
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Edit Account Name"}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Save",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"firstName"}
          label={"First Name"}
          hasError={!!errors.firstName}
          errorMessage={errors.firstName?.message}
        />
        <TextInput
          name={"lastName"}
          label={"Last Name"}
          hasError={!!errors.lastName}
          errorMessage={errors.lastName?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default UpdateName;
