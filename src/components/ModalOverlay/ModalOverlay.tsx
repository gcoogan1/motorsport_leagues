import type { ReactNode } from "react";
import {
  Overlay,
} from "./ModalOverlay.styles";

type ModalOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const ModalOverlay = ({
  isOpen,
  onClose,
  children,
}: ModalOverlayProps) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      {children}
    </Overlay>
  );
};

export default ModalOverlay;
