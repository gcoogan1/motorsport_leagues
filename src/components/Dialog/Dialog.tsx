import Button from "../Button/Button";
import { DialogViewport, DialogWrapper, DialogHeader, DialogTitle, DialogSubtitle, DialogActions } from "./Dialog.styles";
import { dialogStyles, type DialogType } from "./Dialog.variants";

// TODO: Add logic to handle open/close

type DialogProps = {
  type: DialogType;
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const Dialog = ({ type = "core", title, subtitle, isOpen , onClose, onContinue }: DialogProps) => {

  if (!isOpen) return null;
  const typeStyle = dialogStyles[type];

  return (
  <DialogViewport>
      <DialogWrapper $typeStyle={typeStyle}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {subtitle && <DialogSubtitle>{subtitle}</DialogSubtitle>}
      </DialogHeader>
      <DialogActions>
        <Button color="base" variant="outlined" onClick={onClose}>Cancel</Button>
        <Button onClick={onContinue}>Continue</Button>
      </DialogActions>
    </DialogWrapper>
  </DialogViewport>
  )
}

export default Dialog