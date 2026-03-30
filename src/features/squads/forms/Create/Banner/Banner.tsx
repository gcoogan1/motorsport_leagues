import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { useModal } from "@/providers/modal/useModal";
import { type AppDispatch, type RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSquadThunk } from "@/store/squads/squad.thunk";
import { withMinDelay } from "@/utils/withMinDelay";
import { clearSquadDraft } from "@/store/squads/squad.slice";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ImageUploadInput from "@/components/Inputs/ImageUploadInput/ImageUploadInput";
import SelectGraphicInput from "@/components/Inputs/SelectGraphicInput/SelectGraphicInput";
import { bannerFormSchema, type BannerFormValues } from "./bannerSchema";
import SquadCreated from "@/features/squads/modals/success/SquadCreated/SquadCreated";

type BannerProps = {
  onBack: () => void;
};

const Banner = ({ onBack }: BannerProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const currentProfileId = useSelector((state: RootState) => state.profile.currentProfile?.id);
  const draft = useSelector((state: RootState) => state.squad.draft);

  const dispatch = useDispatch<AppDispatch>();

  // -- Form setup -- //
  const formMethods = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      banner: {
        type: "preset",
        variant: "badge1",
      },
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: BannerFormValues) => {
    try {
      setIsLoading(true);
      const founderProfileId = draft?.founder_profile_id ?? currentProfileId;
      if (!accountId || !founderProfileId || !draft?.squad_name) return;

      const banner =
        data.banner.type === "preset"
          ? { type: "preset" as const, variant: data.banner.variant }
          : data.banner;
          
      const payload = {
        founderAccountId: accountId,
        founderProfileId,
        squadName: draft.squad_name,
        banner,
      };

      const result = await withMinDelay(
        (async () => {
          const profile = await dispatch(createSquadThunk(payload)).unwrap();
          await dispatch(clearSquadDraft());
          return profile;
        })(),
        1000,
      );
      if (result) navigate(`/squad/${result.data.id}`);
      openModal(<SquadCreated />);
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
        title={"Create New Squad"}
        question={"Select a Banner Image for your Squad!"}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Back",
            action: handleOnBack,
          },
          onContinue: {
            label: "Finish",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ImageUploadInput
          name="banner"
          hasError={!!errors.banner}
          errorMessage={"Image upload failed. Please try again."}
          helperMessage="JPG or PNG up to 5MB"
        />

        <SelectGraphicInput name="banner" label="Select Banner" />
      </FormBlock>
    </FormProvider>
  );
};

export default Banner;
