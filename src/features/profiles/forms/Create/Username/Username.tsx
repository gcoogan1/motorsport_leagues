import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withMinDelay } from "@/utils/withMinDelay";
import { type AppDispatch, type RootState } from "@/store";
import { updateProfileDraft } from "@/store/profile/profile.slice";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import { USERNAME_VARIANTS } from "./Username.variants";
import { getUsernameSchema, type UsernameFormValues } from "./usernameSchema";

type UsernameProps = {
  onSuccess?: () => void;
  onBack?: () => void;
};

const Username = ({ onSuccess, onBack }: UsernameProps) => {
  const draft = useSelector((state: RootState) => state.profile.draft);
  const schema = getUsernameSchema(draft.gameType);
  const content = USERNAME_VARIANTS[draft.gameType || "gt7"];

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  //  - Form setup -- //
  const formMethods = useForm<UsernameFormValues>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // - Handlers -- //

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleOnSubmit = async (data: UsernameFormValues) => {
    setIsLoading(true);
    await withMinDelay(
      (async () => {
        // Update draft in Redux store
        dispatch(updateProfileDraft({ username: data.username }));
      })(),
      1000,
    );

    // Move to next step
    onSuccess?.();
    setIsLoading(false);
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Create New Profile"}
        question={content.question}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Close", action: handleGoBack },
          onContinue: {
            label: "Continue",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"username"}
          label={content.label}
          helperText={content.inputHelpMsg}
          hasError={!!errors.username}
          errorMessage={errors.username?.message}
          icon={<ProfileIcon />}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default Username;
