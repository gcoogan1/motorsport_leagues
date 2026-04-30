import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { navigate } from "@/app/navigation/navigation";
import { leagueApi } from "@/rtkQuery/API/leagueApi";
import { withMinDelay } from "@/utils/withMinDelay";
import { type AppDispatch, type RootState } from "@/store";
import { deleteLeagueThunk } from "@/store/leagues/league.thunk";
import { selectCurrentLeague } from "@/store/leagues/league.selectors";
import TextInput from "@/components/Inputs/TextInput/TextInput.tsx";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { confirmDeleteLeagueSchema, type ConfirmDeleteLeagueSchema } from "./confirmDeleteLeague.schema";


type DeleteLeagueProps = {
  currentLeague: ReturnType<typeof selectCurrentLeague>;
};

const DeleteLeague = ({ currentLeague }: DeleteLeagueProps) => {
  const { openModal, closeModal } = useModal();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  // -- Form setup -- //
  const formMethods = useForm<ConfirmDeleteLeagueSchema>({
    resolver: zodResolver(confirmDeleteLeagueSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (!currentLeague) return null;

  // -- Handlers -- //
  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      await withMinDelay(
        dispatch(deleteLeagueThunk(currentLeague.id)).unwrap(),
        1000,
      );

      // Force RTK Query to refetch league data so image and info are fresh
      dispatch(
        leagueApi.util.invalidateTags([
          { type: "Leagues", id: `leagues-all--exclude-own` },
          { type: "Leagues", id: `participant-leagues-${accountId}` },
          { type: "Leagues", id: `profile-${accountId}` },
        ])
      );

      navigate("/");
      closeModal();
      showToast({
        usage: "success",
        message: "League has been deleted.",
      });
      return;
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Delete League"}
        helperMessage={
          <>
            This entire League will be deleted and unrecoverable. All data that has been stored in all the Seasons will also be deleted and become unrecoverable.
            <br />
            <br />
            <strong>Please type “delete league” below to confirm.</strong>
          </>
        }
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Delete League",
            loading: isLoading,
            loadingText: "Loading...",
            isDanger: true,
          },
        }}
      >
        <TextInput
          name={"confirmation"}
          label={"Confirm Deletion"}
          hasError={!!errors.confirmation}
          errorMessage={errors.confirmation?.message}
          placeholder={'"delete league"'}
        />
      </FormModal>
    </FormProvider>
  );
};

export default DeleteLeague;
