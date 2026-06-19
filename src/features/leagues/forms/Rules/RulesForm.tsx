import { useEffect, useMemo, useState } from "react";
import RichTextEditor from "@/components/Inputs/RichTextEditor/RichTextEditor";
import SheetForm from "@/components/Sheets/SheetForm/SheetForm";
import {
  useAddLeagueRulesMutation,
  useGetLeagueRulesQuery,
  useUpdateLeagueRulesMutation,
} from "@/rtkQuery/API/leagueApi";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { uploadLeagueRulesImage } from "@/services/league/leagueRules.service";

type RulesFormProps = {
  leagueId: string;
  seasonName: string;
  onDirtyChange?: (isDirty: boolean) => void;
};

const RulesForm = ({ leagueId, seasonName, onDirtyChange }: RulesFormProps) => {
  const { openModal } = useModal();
  const { showToast } = useToast();
  const { data: rulesData, isFetching } = useGetLeagueRulesQuery(leagueId, {
    skip: !leagueId,
  });
  const [addLeagueRules] = useAddLeagueRulesMutation();
  const [updateLeagueRules] = useUpdateLeagueRulesMutation();
  const [rulesContent, setRulesContent] = useState("");
  const [savedRulesContent, setSavedRulesContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const nextRules = rulesData?.rules ?? "";
    setRulesContent(nextRules);
    setSavedRulesContent(nextRules);
  }, [rulesData?.rules]);

  const isDirty = useMemo(
    () => rulesContent !== savedRulesContent,
    [rulesContent, savedRulesContent],
  );

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleSave = async () => {
    if (!leagueId) {
      return;
    }

    try {
      setIsSaving(true);

      if (rulesData?.id) {
        await withMinDelay(
          updateLeagueRules({ leagueId, rules: rulesContent }).unwrap(),
          500,
        );
      } else {
        await withMinDelay(
          addLeagueRules({ leagueId, rules: rulesContent }).unwrap(),
          500,
        );
      }

      setSavedRulesContent(rulesContent);
      showToast({
        usage: "success",
        message: "Rules updated.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const result = await uploadLeagueRulesImage({ leagueId, file });

    if (!result.success) {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      throw new Error(result.error.message);
    }

    return result.data.src;
  };

  const listChildren = (
    <RichTextEditor
      value={rulesContent}
      onChange={setRulesContent}
      onImageUpload={handleImageUpload}
      placeholder="Add league rules and regulations for participants."
      showCount={false}
    />
  );

  return (
    <SheetForm
      id={"rules"}
      seasonName={seasonName}
      header={"Rules & Regulations"}
      listChildren={listChildren}
      onSave={handleSave}
      isSaving={isSaving || isFetching}
    />
  );
};

export default RulesForm;
