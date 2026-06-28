import ChatIcon from "@assets/Icon/Chat.svg?react"
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage"
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout"

const LeagueChat = () => {
  return (
    <PanelLayout
      panelTitleIcon={<ChatIcon />}
      panelTitle="League Chat"
    >
      <EmptyMessage
        icon={<ChatIcon />}
        title="Coming Soon!"
        subtitle="Chat with all the League participants when this feature is released."
      />
    </PanelLayout>
  )
}

export default LeagueChat;