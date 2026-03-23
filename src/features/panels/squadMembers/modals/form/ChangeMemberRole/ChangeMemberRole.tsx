import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import {
  type ChangeMemberRoleSchema,
  changeMemberRoleSchema,
} from "./changeMemberRole.schema";
import { useUpdateSquadMemberRole } from "@/hooks/rtkQuery/mutations/useSquadMutation";

type ChangeMemberRoleProps = {
  currentSquadId: string;
  profileId: string;
  currentRole: string;
  memberUserInfo: {
    // type User from ReadOnlyInput.profile
    username: string;
    information: string;
    size: "small" | "medium" | "large";
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
};

const ChangeMemberRole = ({
  currentSquadId,
  profileId,
  memberUserInfo,
}: ChangeMemberRoleProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updateSquadMemberRole] = useUpdateSquadMemberRole();

  // -- Form setup -- //
  const formMethods = useForm<ChangeMemberRoleSchema>({
    resolver: zodResolver(changeMemberRoleSchema),
    defaultValues: {
      memberRole: "member",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (values: ChangeMemberRoleSchema) => {
    try {
      setIsLoading(true);

      await withMinDelay(
        (async () => {
          const res = await updateSquadMemberRole({
            squadId: currentSquadId,
            profileId,
            newRole: values.memberRole,
          }).unwrap();

          if (!res.success) {
            throw new Error("Failed to update member role");
          }
        })(),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Member role changed.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
    closeModal();
    return;
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Change Member Role"}
        helperMessage={
          "Squad Members can be assigned a “Founder” role, which gives them administrative control over the Squad. They’ll be able to invite and remove Members, change roles, and edit the Squad."
        }
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
        <ReadOnlyInput label="Squad Member" profile={memberUserInfo} />
        <SelectInput
          name="memberRole"
          label="Role"
          options={[
            { label: "Member", value: "member" },
            { label: "Founder", value: "founder" },
          ]}
          hasError={Boolean(errors.memberRole)}
          errorMessage={errors.memberRole?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default ChangeMemberRole;
