import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "@/app/navigation/navigation";
import { useModal } from "@/providers/modal/useModal";
import { type AppDispatch, type RootState } from "@/store";
import { withMinDelay } from "@/utils/withMinDelay";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { updateSquadDraft } from "@/store/squads/squad.slice";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { founderProfileSchema, type FounderFormValues } from "./founderSchema";

type FounderProps = {
  onSuccess: () => void;
};

const Founder = ({ onSuccess }: FounderProps) => {
  const { openModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector((state: RootState) => state.profile.data);
  const formatedProfiles = convertProfilesToSelectOptions(profiles || []);

  // -- Form setup -- //
  const formMethods = useForm<FounderFormValues>({
    resolver: zodResolver(founderProfileSchema),
    defaultValues: {
      founder: profiles?.[0]?.id ?? "",
    },
    // Triggers validation on every change so 'errors' updates instantly
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //

  const handleOnSubmit = async (data: FounderFormValues) => {
    try {
      setIsLoading(true);

      // Success
      await withMinDelay(
        (async () => {
          dispatch(updateSquadDraft({ founder_profile_id: data.founder }));
        })(),
        1000,
      );

      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // General error handling
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigate("/", { replace: true });
        }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title="Create new Squad"
        question="Which Profile do you want to lead this Squad with?"
        helperMessage="A Profile is needed as a Founder to create a Squad."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: handleOnCancel },
          onContinue: {
            label: "Continue",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="founder"
          type="profile"
          fieldLabel="Founder"
          isLarge
          helperText="You change and add Founders once the Squad is created."
          profiles={formatedProfiles}
          hasError={!!errors.founder}
          errorMessage={errors.founder?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default Founder;
