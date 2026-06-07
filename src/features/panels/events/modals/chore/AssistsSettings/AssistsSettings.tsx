import { useState } from "react";
import { FormProvider, useForm, useFormContext, type UseFormReturn } from "react-hook-form";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { type AdvancedSettingsFormData } from "../../../forms/AdvancedSettings/advancedSettings.schema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import FormRow from "@/components/Forms/FormRow/FormRow";
import { ABS_OPTIONS, ACTIVE_STABILITY_MANAGE_OPTIONS, AUTO_DRIVE_OPTIONS, COUNTERSTEERING_ASSIST_OPTIONS, DRIVING_LANE_ASSIST_OPTIONS, TRACTION_CONTROL_OPTIONS } from "@/lib/constants/assistsSettings";

type AssistsSettingsProps = {
  formMethods?: UseFormReturn<AdvancedSettingsFormData>;
  setValue?: ReturnType<typeof useFormContext<AdvancedSettingsFormData>>["setValue"];
};

const AssistsSettings = ({ formMethods, setValue: propSetValue }: AssistsSettingsProps) => {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  // -- Form Setup -- //

  // This component can be used in two ways:
  // 1. As a standalone form within a modal, in which case it manages its own form state and updates the parent form on close.
  // 2. As a child component within the AdvancedSettings form, in which case it uses the form context provided by the parent and updates values directly on change.
  const fallbackFormMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      countersteeringAssist: "noLimit",
      activeStabilityManage: "noLimit",
      drivingLaneAssist: "noLimit",
      tractionControl: "noLimit",
      abs: "noLimit",
      autoDrive: "noLimit",
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
        propSetValue("countersteeringAssist", currentValues.countersteeringAssist);
        propSetValue("activeStabilityManage", currentValues.activeStabilityManage);
        propSetValue("drivingLaneAssist", currentValues.drivingLaneAssist);
        propSetValue("tractionControl", currentValues.tractionControl);
        propSetValue("abs", currentValues.abs);
        propSetValue("autoDrive", currentValues.autoDrive);
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
        question={"Driving Options Limitations"}
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
            name="countersteeringAssist"
            label="Countersteering Assist"
            options={COUNTERSTEERING_ASSIST_OPTIONS}
          />
          <SelectInput
            name="activeStabilityManage"
            label="Active Stability Management (ASM)"
            options={ACTIVE_STABILITY_MANAGE_OPTIONS}
            style={isMobile ? { maxWidth: "100%" } : { maxWidth: "200px" }}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="drivingLaneAssist"
            label="Driving Lane Assist"
            options={DRIVING_LANE_ASSIST_OPTIONS}
          />
          <SelectInput
            name="tractionControl"
            label="Traction Control"
            options={TRACTION_CONTROL_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="abs"
            label="ABS"
            options={ABS_OPTIONS}
          />
          <SelectInput
            name="autoDrive"
            label="Auto-Drive"
            options={AUTO_DRIVE_OPTIONS}
          />
        </FormRow>
      </FormModal>
    </FormProvider>
  );
};

export default AssistsSettings;
