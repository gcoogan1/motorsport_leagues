import ChatIcon from "@assets/Icon/Chat.svg?react"
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage"
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout"


const SquadChat = () => {
  return (
    <PanelLayout
      panelTitleIcon={<ChatIcon />}
      panelTitle="Squad Chat"
    >
      <EmptyMessage
        icon={<ChatIcon />}
        title="Coming Soon!"
        subtitle="Chat with the Squad members when this feature is released."
      />
    </PanelLayout>
  )
}

export default SquadChat;