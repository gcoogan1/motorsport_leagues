import { useState, useCallback, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import DatePicker from "@/components/Inputs/DatePicker/DatePicker";
import TimeInput from "@/components/Inputs/TimeInput/TimeInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import EditIcon from "@assets/Icon/Edit.svg?react";
import PanelForm from "@/components/Forms/PanelForm/PanelForm";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventSettingsSchema,
  type EventSettingsFormValues,
} from "./eventSettings.schema";
import type { EventTable } from "@/types/event.types";
import { useUpdateEvent } from "@/rtkQuery/hooks/mutations/useEventMutaion";
import { combineEventDateAndTime, getTimeFromDate } from "@/utils/dates";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";
import { usePanel } from "@/providers/panel/usePanel";
import FormRow from "@/components/Forms/FormRow/FormRow";

type EventSettingsProps = {
  event: EventTable;
};

const EventSettings = ({ event }: EventSettingsProps) => {
  const { closePanel, setOutsidePanelCloseHandler } = usePanel();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [updateEventSettings] = useUpdateEvent();

  // -- Form Setup -- //

  const formMethods = useForm<EventSettingsFormValues>({
    resolver: zodResolver(eventSettingsSchema),
    defaultValues: {
      eventName: event.event_name,
      eventDate: event.event_date && new Date(event.event_date) || new Date(),
      eventTime: getTimeFromDate(
        event.event_date,
        event.event_time_zone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      ) || "12:00",
      broadcastUrl: event.broadcast_url ?? "",
      revealDate: event.reveal_date,
      revealBroadcast: event.reveal_broadcast,
    },
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = formMethods;

  const revealDate = watch("revealDate");
  const revealBroadcast = watch("revealBroadcast");

  // -- Handlers -- //

  const handleHideDateTimeChange = () => {
    setValue("revealDate", !revealDate, {
      shouldDirty: true,
    });
  };

  const handleHideBroadcastUrlChange = () => {
    setValue("revealBroadcast", !revealBroadcast, {
      shouldDirty: true,
    });
  };

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

  // This effect sets up a handler to prompt the user if they try to close the panel with unsaved changes. It cleans up the handler when the component unmounts or dependencies change.
  useEffect(() => {
    setOutsidePanelCloseHandler(handleAttemptClose);

    return () => {
      setOutsidePanelCloseHandler(null);
    };
  }, [handleAttemptClose, setOutsidePanelCloseHandler]);

  const handleSave = handleSubmit(async (data) => {
    setIsSaving(true);
    try {
      const eventDate = combineEventDateAndTime(
        data.eventDate,
        data.eventTime,
        event.event_time_zone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      );

      await withMinDelay(
        updateEventSettings({
          eventId: event.id,
          eventName: data.eventName,
          eventDate: eventDate,
          eventTimeZone:
            event.event_time_zone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          broadcastUrl: data.broadcastUrl || "",
          revealDate: data.revealDate,
          revealBroadcast: data.revealBroadcast,
        }),
        1000,
      );

      closePanel();
      showToast({
        usage: "success",
        message: "Event settings updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  });

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
        <TextInput
          name="eventName"
          label="Event Name"
          placeholder="Enter event name"
          hasError={!!errors.eventName}
          errorMessage={errors.eventName?.message}
          showCounter
          maxLength={32}
        />
        <PanelForm
          title="Date & Time"
          checkboxOption={{
            label: "Don't Reveal",
            checked: !revealDate,
            onChange: handleHideDateTimeChange,
          }}
        >
          <FormRow>
            <DatePicker
            name="eventDate"
            label="Date"
            error={errors.eventDate?.message}
          />
          <TimeInput
            name="eventTime"
            label="Time"
            hasError={!!errors.eventTime}
            errorMessage={errors.eventTime?.message}
          />
          </FormRow>
        </PanelForm>
        <PanelForm
          title="Broadcast Link"
          checkboxOption={{
            label: "Don't Reveal",
            checked: !revealBroadcast,
            onChange: handleHideBroadcastUrlChange,
          }}
        >
          <TextInput
            name="broadcastUrl"
            label="Streaming URL"
            placeholder="e.g. Youtube, Twitch, etc."
            hasError={!!errors.broadcastUrl}
            errorMessage={errors.broadcastUrl?.message}
          />
        </PanelForm>
      </PanelLayout>
    </FormProvider>
  );
};

export default EventSettings;
