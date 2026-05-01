import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch, RootState } from "@/store";
import { updateLeagueDraft } from "@/store/leagues/league.slice";
import { createLeagueThunk } from "@/store/leagues/league.thunk";
import { leagueApi } from "@/rtkQuery/API/leagueApi";
import { getLeagueInvalidationTags } from "@/rtkQuery/API/leagueInvalidation";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import { createSeasonSchema, type CreateSeasonSchema } from "./seasonSchema";
import SegmentedInput from "@/components/Inputs/SegmentedInput/SegmentedInput";
import CheckboxItem from "@/components/Inputs/CheckboxItem/CheckboxItem";
import LeagueCreated from "@/features/leagues/modals/success/LeagueCreated/LeagueCreated";

const NumberOfDivisionsOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

type SeasonProps = {
  onBack: () => void;
};

const Season = ({ onBack }: SeasonProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const profileIds = useSelector((state: RootState) =>
    (state.profile.data ?? []).map((profile) => profile.id),
  );
  const draft = useSelector((state: RootState) => state.league.draft);
  const [numberOfDivisions, setNumberOfDivisions] = useState(
    draft.num_of_divisions ?? 1,
  );
  const [isTeamChampionship, setIsTeamChampionship] = useState(
    draft.is_team_championship ?? false,
  );

  // -- Form setup -- //
  const formMethods = useForm<CreateSeasonSchema>({
    resolver: zodResolver(createSeasonSchema),
    defaultValues: {
      seasonName: draft.season_name ?? "Season 1",
      numOfDivisions: draft.num_of_divisions ?? 1,
      isTeamChampionship: draft.is_team_championship ?? false,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: CreateSeasonSchema) => {
    try {
      setIsLoading(true);

      if (
        !accountId ||
        !draft.league_name ||
        !draft.director_profile_id ||
        !draft.game_type ||
        !draft.hosting_squad_id ||
        !draft.hosting_squad_name ||
        !draft.cover_image ||
        !draft.theme_color
      ) {
        throw new Error("League setup is incomplete. Please go back and try again.");
      }

      const resolvedAccountId = accountId;
      const leagueName = draft.league_name;
      const directorProfileId = draft.director_profile_id;
      const gameType = draft.game_type;
      const hostingSquadId = draft.hosting_squad_id;
      const hostingSquadName = draft.hosting_squad_name;
      const coverImage = draft.cover_image;
      const themeColor = draft.theme_color;

      const createdLeague = await withMinDelay(
        (async () => {
          dispatch(
            updateLeagueDraft({
              season_name: data.seasonName,
              num_of_divisions: data.numOfDivisions,
              is_team_championship: data.isTeamChampionship,
            }),
          );

          const result = await dispatch(
            createLeagueThunk({
              accountId: resolvedAccountId,
              leagueName,
              directorProfileId,
              gameType,
              hostingSquadId,
              hostingSquadName,
              coverImage,
              themeColor,
              seasonName: data.seasonName,
              numOfDivisions: data.numOfDivisions,
              isTeamChampionship: data.isTeamChampionship,
            }),
          ).unwrap();

          // Invalidate participant leagues cache so the panel refetches
          if (accountId || profileIds.length > 0) {
            dispatch(
              leagueApi.util.invalidateTags(
                getLeagueInvalidationTags({ accountId, profileIds }),
              )
            );
          }

          return result;
        })(),
        1000,
      );

      if (createdLeague) {
        navigate(`/league/${createdLeague.id}`);
      }

      openModal(<LeagueCreated leagueId={createdLeague.id} />);

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
      <FormBlock
        title="Create New League"
        question="Create Your First Season"
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
      </FormBlock>
    </FormProvider>
  );
};

export default Season;
