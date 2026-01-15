import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateNameSchema, updateNameSchema } from "./updateNameSchema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/ModalProvider";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import type { ProfileTable } from "@/types/profile.types";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/store";
import { updateProfileNameThunk } from "@/store/profile/profile.thunks";
import NameUpdateFail from "../../modals/errors/NameUpdateFail/NameUpdateFail";
import { useToast } from "@/providers/toast/useToast";

type UpdateNameProps = {
  profile: ProfileTable;
};

const UpdateName = ({ profile }: UpdateNameProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
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
    console.log("Form Data:", data);
    try {
      const res = await dispatch(
        updateProfileNameThunk({
          firstName: data.firstName,
          lastName: data.lastName,
          userId: profile.id,
        })
      ).unwrap();
      if (!res.success) {
        openModal(<NameUpdateFail />);
      }
      showToast({
        usage: "success",
        message: "Account Name updated.",
      });

      closeModal();
    } catch (error) {
      openModal(<NameUpdateFail />);
      console.error("Reset password error:", error);
      return;
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
