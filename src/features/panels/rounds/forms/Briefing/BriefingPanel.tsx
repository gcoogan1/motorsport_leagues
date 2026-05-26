import { useCallback, useEffect, useMemo, useState } from "react";
import BriefingIcon from "@assets/Icon/Briefing.svg?react"
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout"
import RichTextEditor from "@/components/Inputs/RichTextEditor/RichTextEditor";
import { useGetRoundByIdQuery, useUpdateRoundMutation } from "@/rtkQuery/API/roundApi";
import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { uploadRoundBriefingImage } from "@/services/round/round.service";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";
import { MAX_CHARACTERS } from "@/components/Inputs/RichTextEditor/RichTextEditor.util";
import { briefingPanelSchema } from "./briefingPanel.schema";

type BriefingPanelProps = {
  roundId: string;
}


const BriefingPanel = ({ roundId }: BriefingPanelProps) => {
  const { openModal } = useModal();
  const { closePanel, setOutsidePanelCloseHandler } = usePanel();
  const { showToast } = useToast();
  const [briefingContent, setBriefingContent] = useState("");
  const [savedBriefingContent, setSavedBriefingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const round = useGetRoundByIdQuery(roundId, {
    skip: !roundId,
  });
  const [updateRound] = useUpdateRoundMutation();

  useEffect(() => {
    const nextBriefing = round.data?.briefing || "";
    setBriefingContent(nextBriefing);
    setSavedBriefingContent(nextBriefing);
    setErrorMessage(undefined);
  }, [round.data?.briefing]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (briefingContent === savedBriefingContent) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [briefingContent, savedBriefingContent]);

  const validationResult = useMemo(
    () => briefingPanelSchema.safeParse({ briefing: briefingContent }),
    [briefingContent],
  );

  const validateBriefing = () => {
    if (validationResult.success) {
      setErrorMessage(undefined);
      return true;
    }

    setErrorMessage(validationResult.error.issues[0]?.message ?? "Invalid driver briefing.");
    return false;
  };

  const handleBriefingChange = (nextValue: string) => {
    setBriefingContent(nextValue);

    const nextValidation = briefingPanelSchema.safeParse({ briefing: nextValue });

    setErrorMessage(
      nextValidation.success ? undefined : (nextValidation.error.issues[0]?.message ?? "Invalid driver briefing."),
    );
  };

  const handleSave = async () => {
    if (!validateBriefing()) {
      return;
    }

    try {
      setIsSaving(true);

      const updatedRound = await withMinDelay(
        updateRound({
          roundId,
          briefing: briefingContent,
        }).unwrap(),
        500,
      );

      const nextBriefing = updatedRound.briefing || "";
      setBriefingContent(nextBriefing);
      setSavedBriefingContent(nextBriefing);
      setErrorMessage(undefined);
      closePanel();
      showToast({
        usage: "success",
        message: "Driver briefing saved.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const result = await uploadRoundBriefingImage({ roundId, file });

    if (!result.success) {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      throw new Error(result.error.message);
    }

    return result.data.src;
  };

  const handleAttemptClose = useCallback(() => {
    if (briefingContent === savedBriefingContent) {
      closePanel();
      return;
    }

    openModal(
      <UnsavedChanges
        onDiscard={() => {
          setBriefingContent(savedBriefingContent);
          setErrorMessage(undefined);
          closePanel();
        }}
      />,
    );
  }, [briefingContent, closePanel, openModal, savedBriefingContent]);

  useEffect(() => {
    setOutsidePanelCloseHandler(handleAttemptClose);

    return () => {
      setOutsidePanelCloseHandler(null);
    };
  }, [handleAttemptClose, setOutsidePanelCloseHandler]);

  return (
    <PanelLayout
      panelTitle="Briefing"
      panelTitleIcon={<BriefingIcon />}
      onClose={handleAttemptClose}
      actions={{
        primary: {
          label: "Save",
          action: handleSave,
          loading: isSaving,
          loadingText: "Saving...",
          color: "primary"
        },
      }}
    >
      <RichTextEditor
        label="Driver Briefing"
        value={briefingContent}
        onChange={handleBriefingChange}
        onImageUpload={handleImageUpload}
        placeholder="Enter notes for drivers about this round..."
        maxCharacters={MAX_CHARACTERS}
        hasError={Boolean(errorMessage)}
        errorMessage={errorMessage}
      />
    </PanelLayout>
  )
}

export default BriefingPanel;