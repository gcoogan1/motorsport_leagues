import AnnouncementsIcon from "@assets/Icon/Announcements.svg?react"
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage"
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout"

const Announcements = () => {
  return (
    <PanelLayout
      panelTitleIcon={<AnnouncementsIcon />}
      panelTitle="Announcements"
    >
      <EmptyMessage
        icon={<AnnouncementsIcon />}
        title="Coming Soon"
        subtitle="View important Announcements from the League Director(s) when this feature is released."
      />
    </PanelLayout>
  )
}

export default Announcements;