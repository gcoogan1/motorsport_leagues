import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLeagueSeason } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";

import SegmentedInput from "@/components/Inputs/SegmentedInput/SegmentedInput";
import CheckboxItem from "@/components/Inputs/CheckboxItem/CheckboxItem";
import { navigate } from "@/app/navigation/navigation";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { type CreateNewSeasonSchema, createNewSeasonSchema } from "./createSeason.schema";
import { updateLeagueThunk } from "@/store/leagues/league.thunk";

const NumberOfDivisionsOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

type SeasonProps = {
  leagueId: string;
  onBack: () => void;
};

const Season = ({ leagueId, onBack }: SeasonProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const accountId = useSelector((state: RootState) => state.account.data?.id);

  const [createLeagueSeason] = useCreateLeagueSeason();
  const [numberOfDivisions, setNumberOfDivisions] = useState(1);
  const [isTeamChampionship, setIsTeamChampionship] = useState(false);

  // -- Form setup -- //
  const formMethods = useForm<CreateNewSeasonSchema>({
    resolver: zodResolver(createNewSeasonSchema),
    defaultValues: {
      seasonName: "Season 1",
      numOfDivisions: 1,
      isTeamChampionship: false,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: CreateNewSeasonSchema) => {
    try {
      setIsLoading(true);

        const targetLeagueId = leagueId;

        if (!targetLeagueId) {
          throw new Error("Missing league id for season creation.");
        }

        const result = await withMinDelay(
          createLeagueSeason({
            leagueId: targetLeagueId,
            seasonName: data.seasonName,
            numOfDivisions: data.numOfDivisions,
            isTeamChampionship: data.isTeamChampionship,
          }).unwrap(),
          1000,
        );

        if (!result.success) {
          throw new Error("Failed to create season. Please try again.");
        }

        if (accountId) {
          await dispatch(
            updateLeagueThunk({
              accountId,
              leagueId: targetLeagueId,
              leagueStatus: result.data.season_status,
            }),
          ).unwrap();
        }

        navigate(`/league/${targetLeagueId}`);
        closeModal();
        showToast({
          usage: "success",
          message: "New Season has been created.",
        });
        return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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
      <FormModal
        question="Create Your Next Season"
        helperMessage="Seasons are self-contained championships within a League. They have their own overview, lineup, schedule, standings and rules."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Back", action: handleOnBack },
          onContinue: {
            label: "Finish",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"seasonName"}
          label={"Season Name"}
          maxLength={16}
          showCounter
          placeholder="Season 1"
          hasError={!!errors.seasonName}
          errorMessage={errors.seasonName?.message}
        />
        <SegmentedInput
          name="numOfDivisions"
          inputLabel={"Number of Divisions"}
          options={NumberOfDivisionsOptions}
          value={numberOfDivisions}
          onChange={(value) => {
            const nextValue = Number(value);
            setNumberOfDivisions(nextValue);
            setValue("numOfDivisions", Number(value), {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          helperMessage={errors.numOfDivisions?.message}
        />
        <CheckboxItem
          name="isTeamChampionship"
          label="Include Team Championship"
          checked={isTeamChampionship}
          helperMessage="Allow drivers to be placed in teams that have their own lineup and standings."
          onChange={(checked) => {
            setIsTeamChampionship(checked);
            setValue("isTeamChampionship", checked, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      </FormModal>
    </FormProvider>
  );
};

export default Season;
