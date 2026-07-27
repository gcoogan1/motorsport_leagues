import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import  { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import  { withMinDelay } from "@/utils/withMinDelay";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { announcementSchema, type AnnouncementSchema } from "./createAnnoucement.schema";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import TextAreaInput from "@/components/Inputs/TextAreaInput/TextAreaInput";
import { useCreateAnnouncement } from "@/rtkQuery/hooks/mutations/useAnnouncementsMutation";

type CreateAnnouncementProps = {
  leagueId: string;
  seasonId: string;
  seasonName: string;
  leagueDirectorId: string;
}

const CreateAnnouncement = ({ leagueId, seasonId, seasonName, leagueDirectorId }: CreateAnnouncementProps) => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [createAnnouncement] = useCreateAnnouncement();

  // -- Form setup -- //
  const formMethods = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: AnnouncementSchema) => {
    try {
      setIsLoading(true);

      await withMinDelay(
        createAnnouncement({
          leagueId,
          seasonId,
          seasonName,
          leagueDirectorId,
          title: data.title,
          message: data.message,
        }).unwrap(),
        1000,
      );

      // Show success toast on success
      showToast({
        usage: "success",
        message: "Announcement created.",
      });
      closeModal();
    } catch {
      // General error handling
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnCancel = () => {
    closeModal();
  };
  
  
  return (
    <FormProvider {...formMethods}>
      <FormModal
        question="League Announcement"
        helperMessage="Create a message to post to the entire League."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: {
            label: "Cancel",
            action: handleOnCancel,
          },
          onContinue: {
            label: "Post Announcement",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name="title"
          label="Title"
          errorMessage={errors.title?.message}
          hasError={!!errors.title}
          showCounter
          maxLength={64}
        />
        <TextAreaInput
          name="message"
          label="Message"
          errorMessage={errors.message?.message}
          hasError={!!errors.message}
          showCounter
          maxLength={1000}
        />
      </FormModal>
    </FormProvider>
  )
}

export default CreateAnnouncement