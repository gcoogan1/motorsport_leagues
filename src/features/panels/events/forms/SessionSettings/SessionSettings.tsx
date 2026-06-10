import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import { useToast } from "@/providers/toast/useToast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sessionSettingsSchema, type SessionSettingsFormValues } from "./sessionSettings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";
import EditIcon from "@assets/Icon/Edit.svg?react";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import PanelForm from "@/components/Forms/PanelForm/PanelForm";
import CheckboxForm from "@/components/Forms/CheckboxForm/CheckboxForm";
import SegmentedInput from "@/components/Inputs/SegmentedInput/SegmentedInput";
import { LENGTH_OPTIONS, SESSION_TIME_OPTIONS } from "@/lib/constants/sessions";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import IncrementInput from "@/components/Inputs/IncrementInput/IncrementInput";
import SelectSession from "../../modals/errors/SelectSession/SelectSession";
import { useEventSessionSettings } from "@/rtkQuery/hooks/queries/useEvents";
import { useCreateEventSessionSettings, useUpdateEventSessionSettings } from "@/rtkQuery/hooks/mutations/useEventMutaion";

type SessionSettingsProps = {
  eventId: string;
}

const SessionSettings = ({ eventId }: SessionSettingsProps) => {
  const { closePanel, setOutsidePanelCloseHandler } = usePanel();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { data: existingSessionSettings } = useEventSessionSettings(eventId);
  const [createSessionSettings] = useCreateEventSessionSettings();
  const [updateSessionSettings] = useUpdateEventSessionSettings();

  // Used as a safeguard to ensure that laps and time values are always positive numbers, even if the existing data is malformed. 
  // The form validation will catch any issues when the user tries to save, but this prevents the form from breaking if it encounters invalid data on load.
  const toPositiveNumberOrDefault = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  // -- Form Setup -- //

  const defaultValues = useMemo<SessionSettingsFormValues>(() => ({
    hasQualifying: existingSessionSettings?.has_qualifying ?? false,
    qualifyingType: existingSessionSettings?.qualifying_type ?? "laps",
    qualifyingTime: existingSessionSettings?.qualifying_time ?? "1 Min",
    qualifyingLaps: toPositiveNumberOrDefault(existingSessionSettings?.qualifying_laps, 1),
    raceType: existingSessionSettings?.race_type ?? "laps",
    raceLaps: toPositiveNumberOrDefault(existingSessionSettings?.race_laps, 1),
    raceTime: existingSessionSettings?.race_time ?? "1 Min",
    hasRace: existingSessionSettings?.has_race ?? false,
    revealSession: existingSessionSettings?.reveal_session ?? true,
  }), [existingSessionSettings]);

  const formMethods = useForm<SessionSettingsFormValues>({
    resolver: zodResolver(sessionSettingsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = formMethods;


  useEffect(() => {
    if (isDirty) return;
    reset(defaultValues);
  }, [defaultValues, isDirty, reset]);

  const revealSession = watch("revealSession");
  const hasQualifying = watch("hasQualifying");
  const hasRace = watch("hasRace");
  const qualifyingType = watch("qualifyingType");
  const qualifyingLaps = watch("qualifyingLaps");
  const raceType = watch("raceType");
  const raceLaps = watch("raceLaps");

  // -- Handlers -- //

  const handleAttemptClose = useCallback(() => {
    if (!isDirty) {
      closePanel();
      return;
    }

    openModal(
      <UnsavedChanges
        onDiscard={() => {
          reset();
          closePanel();
        }}
      />,
    );
  }, [closePanel, isDirty, openModal, reset]);

  useEffect(() => {
    setOutsidePanelCloseHandler(handleAttemptClose);

    return () => {
      setOutsidePanelCloseHandler(null);
    };
  }, [handleAttemptClose, setOutsidePanelCloseHandler]);

  const handleRevealSessionChange = () => {
    setValue("revealSession", !revealSession, {
      shouldDirty: true,
    });
  }

  const handleRevealQualifyingChange = () => {
    const hasQualifying = watch("hasQualifying");
    setValue("hasQualifying", !hasQualifying, {
      shouldDirty: true,
    });
  }

  const handleRevealRaceChange = () => {
    const hasRace = watch("hasRace");
    setValue("hasRace", !hasRace, {
      shouldDirty: true,
    });
  }

  const handleQualifyingTypeChange = (value: string | number) => {
    const type = value as "laps" | "time";
    setValue("qualifyingType", type, { shouldDirty: true });
    if (type === "laps") {
      setValue("qualifyingTime", undefined, { shouldDirty: true });
    } else {
      setValue("qualifyingLaps", undefined, { shouldDirty: true });
    }
  }

  const handleRaceTypeChange = (value: string | number) => {
    const type = value as "laps" | "time";
    setValue("raceType", type, { shouldDirty: true });
    if (type === "laps") {
      setValue("raceTime", undefined, { shouldDirty: true });
    } else {
      setValue("raceLaps", undefined, { shouldDirty: true });
    }
  } 

  const handleSave = handleSubmit(
  async (data) => {

    try {
      setIsSaving(true);

      await withMinDelay(
        (async () => {
          const payload = {
            eventId,
            revealSession: data.revealSession,
            hasQualifying: data.hasQualifying,
            qualifyingType: data.hasQualifying ? data.qualifyingType : null,
            qualifyingTime: data.hasQualifying && data.qualifyingType === "time" ? data.qualifyingTime : null,
            qualifyingLaps: data.hasQualifying && data.qualifyingType === "laps" ? data.qualifyingLaps : null,
            hasRace: data.hasRace,
            raceType: data.hasRace ? data.raceType : null,
            raceTime: data.hasRace && data.raceType === "time" ? data.raceTime : null,
            raceLaps: data.hasRace && data.raceType === "laps" ? data.raceLaps : null,
          };

          if (existingSessionSettings) {
            await updateSessionSettings(payload).unwrap();
          } else {
            await createSessionSettings({
              eventId: payload.eventId,
              revealSession: payload.revealSession,
              hasQualifying: payload.hasQualifying,
              qualifyingType: payload.qualifyingType ?? undefined,
              qualifyingTime: payload.qualifyingTime ?? undefined,
              qualifyingLaps: payload.qualifyingLaps ?? undefined,
              hasRace: payload.hasRace,
              raceType: payload.raceType ?? undefined,
              raceTime: payload.raceTime ?? undefined,
              raceLaps: payload.raceLaps ?? undefined,
            }).unwrap();
          }
        })(),
      );

      showToast({ usage: "success", message: "Session settings saved." });
      reset(data);
      closePanel();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  },
  (errors) => {
    if (errors.hasQualifying) {
      openModal(<SelectSession />);
    }
  },
);

  return (
    <FormProvider {...formMethods}>
      <PanelLayout
        panelTitle="Event Settings"
        panelTitleIcon={<EditIcon />}
        onClose={handleAttemptClose}
        actions={{
          primary: {
            label: "Save",
            action: handleSave,
            loading: isSaving,
            loadingText: "Saving...",
            color: "primary",
          },
        }}
      >
        <PanelForm 
          title={"Sessions"}
          hasMultiple
          checkboxOption={{
            label: "Don't Reveal",
            checked: !revealSession,
            onChange: handleRevealSessionChange,
          }}        
        >
          <CheckboxForm checkbox={{
            name: "hasQualifying",
            label: "Qualifying Session",
            checked: hasQualifying,
            onChange: handleRevealQualifyingChange,
          }}>
          <SegmentedInput name="qualifyingType" inputLabel="Length" options={LENGTH_OPTIONS} value={qualifyingType} onChange={handleQualifyingTypeChange} />
          {qualifyingType === "time" ? (
            <SelectInput name="qualifyingTime" options={SESSION_TIME_OPTIONS} />
          ) : (
            <IncrementInput name="qualifyingLaps" label="Number of Laps" min={1} max={999} value={qualifyingLaps} onChange={(val) => setValue("qualifyingLaps", val, { shouldDirty: true })} />
          )}
          </CheckboxForm>
          <CheckboxForm checkbox={{
            name: "hasRace",
            label: "Race Session",
            checked: hasRace,
            onChange: handleRevealRaceChange,
          }}>
            <SegmentedInput name="raceType" inputLabel="Length" options={LENGTH_OPTIONS} value={raceType} onChange={handleRaceTypeChange} />
            {raceType === "time" ? (
              <SelectInput name="raceTime" options={SESSION_TIME_OPTIONS} />
            ) : (
              <IncrementInput name="raceLaps" label="Number of Laps" min={1} max={999} value={raceLaps} onChange={(val) => setValue("raceLaps", val, { shouldDirty: true })} />
            )}
          </CheckboxForm>
        </PanelForm>

      </PanelLayout>
    </FormProvider>
  )
}

export default SessionSettings