import { useModal } from "@/providers/modal/useModal";
import { formatTimeAgo } from "@/utils/dates";
import AnnouncementsIcon from "@assets/Icon/Announcements.svg?react";
import CreateIcon from "@assets/Icon/Create.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import LoadingMessage from "@/components/Messages/LoadingMessage/LoadingMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import CreateAnnouncement from "./forms/Create/CreateAnnouncement";
import { useGetAnnouncementsBySeasonId } from "@/rtkQuery/hooks/queries/useAnnouncements";
import Announcement from "@/components/Messages/Announcement/Announcement";
import UpdateAnnouncement from "./forms/Update/UpdateAnnouncement";
import DeleteAnnouncement from "./modals/chore/DeleteAnnouncement/DeleteAnnouncement";

type AnnouncementsProps = {
  leagueId: string;
  seasonId: string;
  seasonName: string;
  directorId?: string;
  isLeagueDirector?: boolean;
};

const Announcements = ({
  leagueId,
  isLeagueDirector,
  seasonId,
  seasonName,
  directorId,
}: AnnouncementsProps) => {
  const { openModal } = useModal();
  const { data: announcements = [], isLoading } = useGetAnnouncementsBySeasonId(seasonId);

  const handleCreateAnnouncement = () => {
    if (
      !leagueId ||
      !isLeagueDirector ||
      !seasonId ||
      !seasonName ||
      !directorId
    ) {
      return;
    }
    openModal(
      <CreateAnnouncement
        leagueId={leagueId}
        seasonId={seasonId}
        seasonName={seasonName}
        leagueDirectorId={directorId}
      />,
    );
  };

  const handleEditAnnouncement = (announcementId: string, title: string, message: string) => {
    return openModal(<UpdateAnnouncement announcementId={announcementId} title={title} message={message} />);
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    return openModal(
      <DeleteAnnouncement
        announcementId={announcementId}
      />,
    );
  };


  return (
    <PanelLayout
      panelTitleIcon={<AnnouncementsIcon />}
      panelTitle="Announcements"
      actions={
        isLeagueDirector && leagueId
          ? {
              primary: {
                label: "New Announcement",
                leftIcon: <CreateIcon />,
                action: handleCreateAnnouncement,
              },
            }
          : undefined
      }
    >
      {isLoading ? (
        <LoadingMessage />
      ) : announcements && announcements.length > 0 ? (
        announcements.map((announcement) => (
          <Announcement
            key={announcement.id}
            title={announcement.title}
            message={announcement.message}
            createdAt={formatTimeAgo(announcement.created_at)}
            isPinned={false}
            seasonName={seasonName}
            posterInfo={{
              username: announcement.league_director?.username ?? "Unknown",
              avatarType: announcement.league_director?.avatarType ?? "preset",
              avatarValue: announcement.league_director?.avatarValue ?? "black",
            }}
            handleEditClick={() =>
              handleEditAnnouncement(
                announcement.id,
                announcement.title,
                announcement.message,
              )
            }
            handleDeleteClick={() => handleDeleteAnnouncement(announcement.id)}
          />
        ))
      ) : (
        <EmptyMessage
          icon={<AnnouncementsIcon />}
          title="Nothing Here"
          subtitle="No announcements have been posted."
        />
      )}
    </PanelLayout>
  );
};

export default Announcements;
