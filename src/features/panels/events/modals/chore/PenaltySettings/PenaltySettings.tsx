import { FormProvider, useForm, useFormContext, type UseFormReturn } from "react-hook-form";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/useModal";
import { type AdvancedSettingsFormData } from "../../../forms/AdvancedSettings/advancedSettings.schema";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import { useState } from "react";
import { withMinDelay } from "@/utils/withMinDelay";
import FormRow from "@/components/Forms/FormRow/FormRow";
import { CAR_COLLISION_PENALTY_OPTIONS, CORRECT_VEHICLE_COURSE_OPTIONS, FLAG_RULES_OPTIONS, GHOSTING_DURING_RACE_OPTIONS, PIT_LANE_LINE_CUT_OPTIONS, SHORTCUT_PENALTY_OPTIONS, WALL_COLLISION_PENALTY_OPTIONS } from "@/lib/constants/penaltySettings";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type PenaltySettingsProps = {
  formMethods?: UseFormReturn<AdvancedSettingsFormData>;
  setValue?: ReturnType<typeof useFormContext<AdvancedSettingsFormData>>["setValue"];
};

const PenaltySettings = ({ formMethods, setValue: propSetValue }: PenaltySettingsProps) => {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  // -- Form Setup -- //

  // This component can be used in two ways:
  // 1. As a standalone form within a modal, in which case it manages its own form state and updates the parent form on close.
  // 2. As a child component within the AdvancedSettings form, in which case it uses the form context provided by the parent and updates values directly on change.
  const fallbackFormMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      shortcutPenalty: "weak",
      wallCollPenalty: "off",
      correctVehicleCourse: "true",
      carCollPenalty: "false",
      pitLaneLineCutPenalty: "true",
      ghostingDuringRace: "weak",
      flagRules: "true",
    },
  });

  const resolvedFormMethods = formMethods ?? fallbackFormMethods;


  // -- Handlers -- //


  const handleOnClose = () => {
    closeModal();
  };

  const handleOnSave = async () => {
    setIsSaving(true);
    try {
      if (!formMethods && propSetValue) {
        const currentValues = resolvedFormMethods.getValues();
        propSetValue("shortcutPenalty", currentValues.shortcutPenalty, { shouldDirty: true });
        propSetValue("wallCollPenalty", currentValues.wallCollPenalty, { shouldDirty: true });
        propSetValue("correctVehicleCourse", currentValues.correctVehicleCourse, { shouldDirty: true });
        propSetValue("carCollPenalty", currentValues.carCollPenalty, { shouldDirty: true });
        propSetValue("pitLaneLineCutPenalty", currentValues.pitLaneLineCutPenalty, { shouldDirty: true });
        propSetValue("ghostingDuringRace", currentValues.ghostingDuringRace, { shouldDirty: true });
        propSetValue("flagRules", currentValues.flagRules, { shouldDirty: true });
      }

      await withMinDelay(Promise.resolve(), 600);
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...resolvedFormMethods}>
      <FormModal
        question={"Time / Weather Settings"}
        buttons={{
          onCancel: { label: "Close", action: handleOnClose },
          onContinue: {
            label: "Save",
            action: handleOnSave,
            loading: isSaving,
            loadingText: "Saving...",
          },
        }}
      >
        <FormRow>
          <SelectInput
            name="shortcutPenalty"
            label="Shortcut Penalty"
            options={SHORTCUT_PENALTY_OPTIONS}
          />
          <SelectInput
            name="wallCollPenalty"
            label="Wall Collision Penalty"
            options={WALL_COLLISION_PENALTY_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="correctVehicleCourse"
            label="Correct Vehicle Course After Wall Collision"
            options={CORRECT_VEHICLE_COURSE_OPTIONS}
            style={isMobile ? { maxWidth: "100%" } : { maxWidth: "200px" }}
          />
          <SelectInput
            name="carCollPenalty"
            label="Car Collision Penalty"
            options={CAR_COLLISION_PENALTY_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="pitLaneLineCutPenalty"
            label="Pit Lane Line-Cutting Penalty"
            options={PIT_LANE_LINE_CUT_OPTIONS}
            style={isMobile ? { maxWidth: "100%" } : { maxWidth: "200px" }}
          />
          <SelectInput
            name="ghostingDuringRace"
            label="Ghosting During Race"
            options={GHOSTING_DURING_RACE_OPTIONS}
          />
        </FormRow>
        <SelectInput
          name="flagRules"
          label="Flag Rules"
          options={FLAG_RULES_OPTIONS}
        />
      </FormModal>
    </FormProvider>
  );
};

export default PenaltySettings;
