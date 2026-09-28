import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { type ChampionFormValues, championSchema } from "./championSchema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import {
  useGetLeagueChampionsByLeagueAndSeasonQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";
import {
  useAddLeagueChampion,
  useUpdateLeagueChampion,
} from "@/rtkQuery/hooks/mutations/useLeagueMutation";

type ChampionFormProps = {
  onBack: () => void;
  onSuccess?: () => void;
  leagueId: string;
  seasonId: string;
};

const ChampionForm = ({ onBack, onSuccess, leagueId, seasonId }: ChampionFormProps) => {
  const { closeModal, openModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [addLeagueChampion] = useAddLeagueChampion();
  const [updateLeagueChampion] = useUpdateLeagueChampion();
  const currentChampions = useGetLeagueChampionsByLeagueAndSeasonQuery({
    leagueId,
    seasonId,
  });
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(seasonId);
  const uniqueSeasonDrivers = seasonDriversBySeason.data?.filter(
    (driver, index, drivers) =>
      drivers.findIndex(
        (candidate) => candidate.profile_id === driver.profile_id,
      ) === index,
  );

  const driverProfileMap = uniqueSeasonDrivers?.map((driver) => ({
    label: driver.display_name ?? "Unknown driver",
    value: driver.profile_id,
    avatar: {
      avatarType: driver.avatar_type ?? "preset",
      avatarValue: driver.avatar_value ?? "none",
    }
  }));
  const firstDriverProfileId = uniqueSeasonDrivers?.[0]?.profile_id;
  const currentChampion = currentChampions.data?.[0];
  const defaultChampionProfileId =
    currentChampion?.profile_id ?? firstDriverProfileId;

  // -- Form setup -- //
  const formMethods = useForm<ChampionFormValues>({
    resolver: zodResolver(championSchema),
    defaultValues: {
      championName: defaultChampionProfileId ?? "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (defaultChampionProfileId) {
      setValue("championName", defaultChampionProfileId, {
        shouldValidate: true,
      });
    }
  }, [defaultChampionProfileId, setValue]);

  // -- Handlers -- //
  const handleOnSubmit = async (data: ChampionFormValues) => {
    try {
      setIsLoading(true);

      const result = await withMinDelay(
        currentChampion
          ? updateLeagueChampion({
              id: currentChampion.id,
              profileId: data.championName,
            }).unwrap()
          : addLeagueChampion({
              leagueId,
              seasonId,
              profileId: data.championName,
            }).unwrap(),
        1000,
      );

      if (!result.success) {
        throw new Error(result.error.message);
      }

      onSuccess?.();
      closeModal();
      showToast({
        usage: "success",
        message: currentChampion
          ? "Season Champion has been updated."
          : "Season Champion has been crowned.",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
    onBack();
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Crown Champion"}
        helperMessage={"Select the driver that won this season."}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: handleOnCancel },
          onContinue: {
            label: currentChampion ? "Re-Crown!" : "Crown!",
            loading:
              isLoading ||
              currentChampions.isLoading ||
              seasonDriversBySeason.isLoading,
            loadingText: "Loading...",
          },
        }}
        >
        <ProfileSelectInput
          name="championName"
          type="driver"
          fieldLabel="Champion"
          helperText="You can change and add Champions (from the same Squad and Game) once the League is created."
          profiles={driverProfileMap ?? []}
          hasError={!!errors.championName}
          errorMessage={errors.championName?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default ChampionForm;
