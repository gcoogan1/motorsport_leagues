import { FormProvider, useForm } from "react-hook-form";
import {
  seasonSettingsSchema,
  type SeasonSettingsSchema,
} from "./seasonSettings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import type { LeagueSeasonTable } from "@/types/league.types";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import { ButtonContainer, ListContainer } from "./SeasonSettings.styles";
import SegmentedInput from "@/components/Inputs/SegmentedInput/SegmentedInput";
import { useEffect, useState } from "react";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import { useModal } from "@/providers/modal/useModal";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useUpdateLeagueSeason } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import { withMinDelay } from "@/utils/withMinDelay";
import { useToast } from "@/providers/toast/useToast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { updateLeagueThunk } from "@/store/leagues/league.thunk";
import Button from "@/components/Button/Button";
import ChampionIcon from "@assets/Icon/Champion.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import CreateSeason from "@/features/leagues/modals/core/CreateSeason/CreateSeason";

const SeasonStatusOptions = [
  { label: "Setup", value: "setup" },
  { label: "Active", value: "active" },
  { label: "Complete", value: "complete" },
];

type SeasonSettingsProps = {
  seasonData: LeagueSeasonTable;
  isMostRecentSeason?: boolean;
  onlyOneSeason?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
};

const SeasonSettings = ({
  seasonData,
  isMostRecentSeason = false,
  onlyOneSeason = true,
  onDirtyChange,
}: SeasonSettingsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [updateLeagueSeason] = useUpdateLeagueSeason();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const [isSaving, setIsSaving] = useState(false);
  const [seasonStatus, setSeasonStatus] = useState<
    SeasonSettingsSchema["seasonStatus"]
  >(seasonData.season_status);

  // -- Form setup -- //
  const formMethods = useForm<SeasonSettingsSchema>({
    resolver: zodResolver(seasonSettingsSchema),
    defaultValues: {
      seasonName: seasonData.season_name,
      seasonStatus: seasonData.season_status,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = formMethods;

  // -- Effects -- //
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    reset({
      seasonName: seasonData.season_name,
      seasonStatus: seasonData.season_status,
    });
    setSeasonStatus(seasonData.season_status);
  }, [reset, seasonData.season_name, seasonData.season_status]);

  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // -- Handlers -- //
  const handleOnInvalidSubmit = () => {
    openModal(<CannotSave />);
  };

  const handleOnSubmit = async (data: SeasonSettingsSchema) => {
    setIsSaving(true);

    try {
      if (!accountId) {
        throw new Error("Missing account id");
      }

      await withMinDelay(
        (async () => {
          const seasonUpdateResult = await updateLeagueSeason({
            seasonId: seasonData.id,
            seasonName: data.seasonName,
            seasonStatus: data.seasonStatus,
          }).unwrap();

          if (!seasonUpdateResult.success) {
            throw new Error("Failed to update season.");
          }

          if (isMostRecentSeason) {
            await dispatch(
              updateLeagueThunk({
                accountId,
                leagueId: seasonData.league_id,
                leagueStatus: data.seasonStatus,
              }),
            ).unwrap();
          }
        })(),
        1000,
      );

      reset(data);
      showToast({
        usage: "success",
        message: "Season settings updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = handleSubmit(handleOnSubmit, handleOnInvalidSubmit);

  const headerChildren =
    seasonData.season_status === "complete" ? (
      <>
        {onlyOneSeason || isMostRecentSeason ? (
          <>
            <SegmentedInput
              name="seasonStatus"
              options={SeasonStatusOptions}
              value={seasonStatus}
              onChange={(value) => {
                const nextValue = value as SeasonSettingsSchema["seasonStatus"];
                setSeasonStatus(nextValue);
                setValue("seasonStatus", nextValue, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              helperMessage={
                "The initial state of a Season is ‘Setup’, which hides the contents while the Directors modify it. The ‘Active’ state then makes those contents visible. Once the Season is finished, the ‘Complete’ states allows a new Season to be created."
              }
            />
            <ButtonContainer>
              <Button
                variant="ghost"
                color="primary"
                icon={{ left: <ChampionIcon /> }}
                fullWidth
              >
                Crown Champion
              </Button>
              <Button
                variant="outlined"
                color="primary"
                icon={{ left: <CreateIcon /> }}
                fullWidth
                onClick={() =>
                  openModal(
                    <CreateSeason
                      leagueId={seasonData.league_id}
                      onBack={() => closeModal()}
                    />,
                  )
                }
              >
                Create Season
              </Button>
            </ButtonContainer>
          </>
        ) : (
          <>
            <SegmentedInput
              name="seasonStatus"
              options={[{ label: "Complete", value: "complete" }]}
              value={"complete"}
              onChange={() => {}}
            />
            <ButtonContainer>
              <Button
                variant="ghost"
                color="primary"
                icon={{ left: <ChampionIcon /> }}
                fullWidth
              >
                Crown Champion
              </Button>
              <Button
                variant="outlined"
                color="danger"
                icon={{ left: <DeleteIcon /> }}
                fullWidth
              >
                Delete Season
              </Button>
            </ButtonContainer>
          </>
        )}
      </>
    ) : (
      <SegmentedInput
        name="seasonStatus"
        options={SeasonStatusOptions}
        value={seasonStatus}
        onChange={(value) => {
          const nextValue = value as SeasonSettingsSchema["seasonStatus"];
          setSeasonStatus(nextValue);
          setValue("seasonStatus", nextValue, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
        helperMessage={
          "The initial state of a Season is ‘Setup’, which hides the contents while the Directors modify it. The ‘Active’ state then makes those contents visible. Once the Season is finished, the ‘Complete’ states allows a new Season to be created."
        }
      />
    );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={`season-settings-${seasonData.id}`}
        seasonName={seasonData.season_name}
        header={"Season Settings"}
        blockHeader="Season Status"
        headerChildren={headerChildren}
        listChildren={
          <ListContainer>
            <TextInput
              name="seasonName"
              label="Season Name"
              maxLength={16}
              showCounter
              hasError={!!errors.seasonName}
              errorMessage={errors.seasonName?.message}
            />
          </ListContainer>
        }
        onSave={onSave}
        isSaving={isSaving || isSubmitting}
        saveLoadingText="Saving Changes..."
      />
    </FormProvider>
  );
};

export default SeasonSettings;
