import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  getLeagueByIdThunk,
  updateLeagueThunk,
} from "@/store/leagues/league.thunk";
import { leagueApi } from "@/rtkQuery/API/leagueApi";
import { getLeagueInvalidationTags } from "@/rtkQuery/API/leagueInvalidation";
import type { UpdateLeaguePayload } from "@/types/league.types";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import {
  formatTimezoneLabel,
  getCurrentTimezone,
} from "@/utils/timezone";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";
import SelectGraphicInput from "@/components/Inputs/SelectGraphicInput/SelectGraphicInput";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import TextAreaInput from "@/components/Inputs/TextAreaInput/TextAreaInput";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import Button from "@/components/Button/Button";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import CannotSave from "@/features/leagues/modals/errors/CannotSave/CannotSave";
import DeleteLeague from "../../DeleteLeague/DeleteLeague";
import { ContentContainer, FormList, ListContainer, LoadingContainer } from "./Settings.styles";
import { settingsFormSchema, type SettingsFormValues } from "./settingsSchema";
import { baseTimezoneOptions, getLeagueSettingsValues, getDefaultSettingsValues } from "./Settings.util";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";

type SettingsProps = {
  leagueId: string;
  onDirtyChange?: (isDirty: boolean) => void;
};


const Settings = ({ leagueId, onDirtyChange }: SettingsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const profileIds = useSelector((state: RootState) =>
    (state.profile.data ?? []).map((profile) => profile.id),
  );
  const currentLeague = useSelector(
    (state: RootState) => state.league.currentLeague,
  );
  const leagueStatus = useSelector((state: RootState) => state.league.status);
  const fallbackTimezone = currentLeague?.timezone ?? getCurrentTimezone();
  const timezoneOptions = currentLeague?.timezone &&
    !baseTimezoneOptions.some((option) => option.value === currentLeague.timezone)
    ? [
        {
          value: currentLeague.timezone,
          label: formatTimezoneLabel(currentLeague.timezone),
          secondaryInfo: "Current league timezone",
        },
        ...baseTimezoneOptions,
      ]
    : baseTimezoneOptions;

  // -- Form Methods -- //
  const formMethods = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues:
      currentLeague?.id === leagueId
        ? getLeagueSettingsValues(
            currentLeague.league_name,
            currentLeague.description,
            currentLeague.timezone,
            fallbackTimezone,
            currentLeague.cover_type,
            currentLeague.cover_value,
            currentLeague.theme_color,
          )
        : getDefaultSettingsValues(fallbackTimezone),
  });

  const {
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = formMethods;

  // Load league data and populate form when league is loaded or leagueId changes
  useEffect(() => {
    if (leagueId && currentLeague?.id !== leagueId) {
      dispatch(getLeagueByIdThunk(leagueId));
    }
  }, [leagueId, currentLeague?.id, dispatch]);

  // When currentLeague is loaded/updated, reset form with league settings values
  useEffect(() => {
    if (!currentLeague || currentLeague.id !== leagueId) {
      return;
    }

    reset({
      ...getLeagueSettingsValues(
        currentLeague.league_name,
        currentLeague.description,
        currentLeague.timezone,
        fallbackTimezone,
        currentLeague.cover_type,
        currentLeague.cover_value,
        currentLeague.theme_color,
      ),
    });
  }, [currentLeague, fallbackTimezone, leagueId, reset]);

  // Notify parent component of dirty state changes for unsaved changes handling at the panel level
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Warn users about unsaved changes if they attempt to close the tab or browser window
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

  // Loading state
  if (
    leagueStatus === "loading" ||
    !currentLeague ||
    currentLeague.id !== leagueId
  ) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  // -- Handlers -- //
  
  const onDeleteLeague = async () => {
    openModal(<DeleteLeague currentLeague={currentLeague} /> );
  };

  const handleOnSubmit = async (data: SettingsFormValues) => {
    try {
      if (!accountId) {
        throw new Error("Missing account id");
      }

      const payload: UpdateLeaguePayload = {
        accountId,
        leagueId: currentLeague.id,
        leagueName: data.leagueName,
        description: data.description,
        timezone: data.timezone,
        themeColor: data.themeColor,
      };

      // Only include a new upload file for cover updates.
      if (data.cover.type === "preset") {
        payload.coverImage = {
          type: "preset",
          variant: data.cover.variant,
        };
      } else if (data.cover.file instanceof File) {
        payload.coverImage = {
          type: "upload",
          file: data.cover.file,
        };
      }

      await withMinDelay(
        dispatch(updateLeagueThunk(payload)).unwrap(),
        1000,
      );

      // Force RTK Query to refetch league data so image and info are fresh
      dispatch(
        leagueApi.util.invalidateTags(
          getLeagueInvalidationTags({ accountId, profileIds }),
        )
      );

      reset(data);

      showToast({
        usage: "success",
        message: "League settings updated.",
      });
    } catch {
      handleSupabaseError(
        { code:"SERVER_ERROR" },
        openModal,
      );
    }
  };

  const handleOnInvalidSubmit = () => {
    openModal(<CannotSave />);
  };

  const onSave = handleSubmit(handleOnSubmit, handleOnInvalidSubmit);

  // -- Form Content -- //

  const headerChildren = (
    <ContentContainer>
      <ImageUploadInput
        name="cover"
        hasError={!!errors.cover}
        errorMessage={errors.cover?.message}
        helperMessage="JPG or PNG up to 5MB"
      />
      <SelectGraphicInput name="cover" label="Select Cover Image" />
      <SelectGraphicInput name="themeColor" label="Select Theme Color" />
    </ContentContainer>
  );

  const listChildern = (
    <ListContainer>
      <FormList>
        <TextInput
          name="leagueName"
          label="Name of League"
          placeholder="Enter league name"
          hasError={!!errors.leagueName}
          errorMessage={errors.leagueName?.message}
          maxLength={50}
          showCounter
        />
        <TextAreaInput
          name="description"
          label="League Description"
          placeholder={`This is ${currentLeague.hosting_squad_name}'s League for ${convertGameTypeToFullName(currentLeague.game_type)}.`}
          hasError={!!errors.description}
          errorMessage={errors.description?.message}
          maxLength={280}
          showCounter
          rows={3}
        />
        <SelectInput
          name="timezone"
          label="Time Zone"
          options={timezoneOptions}
          placeholder="Search timezone"
          helperText="All Events in this League will be created in this time zone."
          hasError={!!errors.timezone}
          errorMessage={errors.timezone?.message}
          isSearchable
        />
      </FormList>
      <Button
        color="danger"
        variant="outlined"
        onClick={onDeleteLeague}
        icon={{ left: <DeleteIcon /> }}
      >
        Delete League
      </Button>
    </ListContainer>
  );

  return (
    <FormProvider {...formMethods}>
      <SheetForm
        id={`league-settings-${leagueId}`}
        seasonName={"Manage League"}
        header="League Settings"
        blockHeader="League Cover & Color"
        listChildren={listChildern}
        headerChildren={headerChildren}
        onSave={onSave}
        isSaving={isSubmitting}
        saveLoadingText="Saving Changes..."
      />
    </FormProvider>
  );
};

export default Settings;
