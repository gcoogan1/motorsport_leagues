import { useModal } from "@/providers/modal/useModal";
import type { GameType } from "@/types/profile.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import Dialog from "@/components/Dialog/Dialog";

type GameProps = {
  gameType: GameType;
};

const Game = ({ gameType }: GameProps) => {
  const { closeModal } = useModal();

  const convertedGameType = convertGameTypeToFullName(gameType);

  return (
    <Dialog
      type="core"
      title={"Game"}
      subtitle={`This League competes on ${convertedGameType}.`}
      buttons={{
        onCancel: {
          label: "Close",
          action: () => closeModal(),
        }
      }}
    />
  );
};

export default Game;