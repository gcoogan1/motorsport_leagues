import { FormProvider, useForm } from "react-hook-form";
import FormModal from "@/components/Forms/FormModal/FormModal";
import MultiInput from "@/components/Inputs/MultiInput/MultiInput";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useJoinLeagueAsParticipant, useRemoveLeagueJoinRequest } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import type { Tag } from "@/components/Tags/Tags.variants";

type ViewRequestProps = {
  leagueId: string;
  request: {
    profileId: string;
    accountId: string;
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    requestedRoles: typeof LEAGUE_PARTICIPANT_ROLES[number][];
    requestIds: string[];
    contactInfo: string;
  };
};

type ViewRequestFormValues = {
  roles: Tag[];
};

const ViewRequest = ({ leagueId, request }: ViewRequestProps) => {
  const { closeModal, openModal } = useModal();
  const { showToast } = useToast();
  const [joinLeagueWithRoles, { isLoading: isJoining }] = useJoinLeagueAsParticipant();
  const [removeLeagueJoinRequest, { isLoading: isRemoving }] = useRemoveLeagueJoinRequest();
  const formMethods = useForm<ViewRequestFormValues>({
    defaultValues: {
      roles: request.requestedRoles as Tag[],
    },
  });

  const { handleSubmit } = formMethods;

  const roleOptions = LEAGUE_PARTICIPANT_ROLES.map((role) => ({
    value: role as Tag,
    label: role.charAt(0).toUpperCase() + role.slice(1),
  }));

  const handleOnSubmit = async (data: ViewRequestFormValues) => {
    const selectedRoles = data.roles as typeof LEAGUE_PARTICIPANT_ROLES[number][];

    if (!selectedRoles.length) {
      showToast({
        usage: "error",
        message: "Select at least one role to accept this request.",
      });
      return;
    }

    try {
      const joinResult = await joinLeagueWithRoles({
        leagueId,
        profileId: request.profileId,
        accountId: request.accountId,
        contactInfo: request.contactInfo,
        roles: selectedRoles,
      }).unwrap();

      if (!joinResult.success) {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
        return;
      }

      const removeResults = await Promise.all(
        request.requestIds.map((requestId) =>
          removeLeagueJoinRequest({
            requestId,
            leagueId,
          }).unwrap(),
        ),
      );

      if (!removeResults.every((result) => result.success)) {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
        return;
      }

      showToast({
        usage: "success",
        message: "New participant added to the League.",
      });

      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Request to Join"}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Accept Request",
            loading: isJoining || isRemoving,
            loadingText: "Loading...",
          },
        }}
      >
        <ReadOnlyInput
          label="Profile"
          profile={{
            username: request.username,
            avatarType: request.avatarType,
            avatarValue: request.avatarValue,
            size: "small",
          }}
        />
        <MultiInput
          name="roles"
          label="Roles"
          options={roleOptions}
          placeholder="Select roles"
        />
        <ReadOnlyInput label="Contact" textValue={request.contactInfo} />
      </FormModal>
    </FormProvider>
  );
};

export default ViewRequest;