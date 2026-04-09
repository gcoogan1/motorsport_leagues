import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch, RootState } from "@/store";
import { updateLeagueDraft } from "@/store/leagues/league.slice";
import { useModal } from "@/providers/modal/useModal";
import { useSquadsByProfileId } from "@/hooks/rtkQuery/queries/useSquads";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import LeagueIcon from "@assets/Icon/League.svg?react";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import SquadSelectInput from "@/components/Inputs/SquadSelectInput/SquadSelectInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import { createHostSchema, type CreateHostSchema } from "./hostSchema";
import { isLeagueNameAvailable } from "@/services/league.service";

type HostProps = {
  onSuccess: () => void;
  onBack: () => void;
};

const Host = ({ onSuccess, onBack }: HostProps) => {
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Get Squads for the selected director profile to populate hosting squad options
  const leagueDraft = useSelector((state: RootState) => state.league.draft);
  const directorProfileId = leagueDraft.director_profile_id;
  const { data: squads = [] } = useSquadsByProfileId(directorProfileId);
  const formattedSquads = squads.map((squad) => ({
    label: squad.squad_name,
    value: squad.id,
    banner:
      squad.banner_type === "upload"
        ? {
            type: "upload" as const,
            file: new File([], "banner"),
            previewUrl: squad.banner_value,
          }
        : {
            type: "preset" as const,
            variant: squad.banner_value as "badge1" | "badge2" | "badge3",
          },
  }));

  // -- Form setup -- //
  const formMethods = useForm<CreateHostSchema>({
    resolver: zodResolver(createHostSchema),
    defaultValues: {
      leagueName: leagueDraft.league_name ?? "",
      hostingSquad: leagueDraft.hosting_squad_id ?? squads[0]?.id,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: CreateHostSchema) => {
    try {
      setIsLoading(true);

      // Check league name availability
      const res = await withMinDelay(
        isLeagueNameAvailable(data.leagueName),
        1000,
      );

      if (!res) {
        handleSupabaseError({ code: "LEAGUE_NAME_TAKEN" }, openModal);
        return;
      }

      // Lookup selected hosting squad name for league draft update
      const selectedSquad = squads.find(
        (squad) => squad.id === data.hostingSquad,
      );

      await withMinDelay(
        (async () => {
          dispatch(
            updateLeagueDraft({
              league_name: data.leagueName,
              hosting_squad_id: data.hostingSquad,
              hosting_squad_name: selectedSquad?.squad_name,
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

  const handleOnBack = () => {
    onBack();
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title="Create New League"
        question="What’s the series called and who’s hosting?"
        helperMessage="Name your League and select the Squad (that your Profile is a member of) you want to host with."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Back", action: handleOnBack },
          onContinue: {
            label: "Continue",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"leagueName"}
          label={"Name of League"}
          maxLength={64}
          showCounter
          icon={<LeagueIcon />}
          placeholder="e.g. GT3 Championship, Formula League, etc."
          hasError={!!errors.leagueName}
          errorMessage={errors.leagueName?.message}
        />
        <SquadSelectInput
          name="hostingSquad"
          fieldLabel="Hosting Squad"
          helperText={
            directorProfileId
              ? "Select one of the squads the chosen director profile belongs to."
              : "Go back and choose a director profile first."
          }
          squads={formattedSquads}
          hasError={!!errors.hostingSquad}
          errorMessage={errors.hostingSquad?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default Host;
