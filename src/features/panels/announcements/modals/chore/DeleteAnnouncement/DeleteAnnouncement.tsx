import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';
import { useToast } from '@/providers/toast/useToast';
import { handleSupabaseError } from '@/utils/handleSupabaseErrors';
import { withMinDelay } from '@/utils/withMinDelay';
import { useState } from 'react';
import { useDeleteAnnouncement } from '@/rtkQuery/hooks/mutations/useAnnouncementsMutation';

type DeleteAnnouncementProps = {
  announcementId: string;
}

const DeleteAnnouncement = ({ announcementId }: DeleteAnnouncementProps) => {
  const { openModal, closeModal } = useModal();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteAnnouncement] = useDeleteAnnouncement();
  
    const handleDeleteAnnouncement = async () => {
      try {
        setIsLoading(true);
        await withMinDelay(
          deleteAnnouncement(announcementId).unwrap(),
          1000,
        );

        showToast({
          usage: "success",
          message: "Announcement deleted.",
        });
      } catch {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      } finally {
        setIsLoading(false);
        closeModal();
      }
    };
  
  return (
    <Dialog 
      type='core'
      title='Delete Announcement'
      subtitle="This post will be deleted. The action cannot be undone."
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Delete",
          isDanger: true,
          action: () => handleDeleteAnnouncement(),
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  )
}

export default DeleteAnnouncement;