import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "@/app/navigation/navigation";
import { useModal } from "@/providers/modal/useModal";
import { useSquadsByProfileId } from "@/rtkQuery/hooks/queries/useSquads";
import { type AppDispatch, type RootState } from "@/store";
import { withMinDelay } from "@/utils/withMinDelay";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { directorProfileSchema, type DirectorFormValues } from "./directorSchema";
import { updateLeagueDraft } from "@/store/leagues/league.slice";

type DirectorProps = {
  onSuccess: () => void;
};

const Director = ({ onSuccess }: DirectorProps) => {
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector((state: RootState) => state.profile.data);
  const formatedProfiles = convertProfilesToSelectOptions(profiles || []);

  // -- Form setup -- //
  const formMethods = useForm<DirectorFormValues>({
    resolver: zodResolver(directorProfileSchema),
    defaultValues: {
      director: profiles?.[0]?.id ?? "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods;


  // Watch for selecedt director to validate squad membership before allowing form submission
  const selectedDirectorId = watch("director");
  // Lookup squads for the selected director profile to ensure they belong to a squad before allowing them to proceed as a league director
  const { data: selectedDirectorSquads, isError: hasSquadLookupError } = useSquadsByProfileId(selectedDirectorId);

  // -- Handlers -- //

  const handleOnSubmit = async (data: DirectorFormValues) => {
    try {
      setIsLoading(true);
      const selectedDirectorProfile = profiles?.find(
        (profile) => profile.id === data.director,
      );

      const belongsToASquad = (selectedDirectorSquads?.length ?? 0) > 0;

      if (!selectedDirectorProfile) {
        throw new Error("Selected profile could not be found.");
      }

      if (hasSquadLookupError) {
        throw new Error("Error looking up squads for the selected profile. Please try again.");
      }

      if (!belongsToASquad) {
        handleSupabaseError({ code: "NO_SQUAD" }, openModal);
        return
      }

      // Success
      await withMinDelay(
        (async () => {
          dispatch(
            updateLeagueDraft({
              director_profile_id: data.director,
              game_type: selectedDirectorProfile.game_type,
            }),
          );
        })(),
        1000,
      );

      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // General error handling
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigate("/", { replace: true });
        }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title="Create New League"
        question="Who’s running the show?"
        helperMessage="Select a Profile to direct this League with. The Profile must be for the game you want to run this League on; and it must be part of a Squad."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: handleOnCancel },
          onContinue: {
            label: "Continue",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="director"
          type="profile"
          fieldLabel="Director"
          isLarge
          helperText="You can change and add Directors (from the same Squad and Game) once the League is created."
          profiles={formatedProfiles}
          hasError={!!errors.director}
          errorMessage={errors.director?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default Director;
