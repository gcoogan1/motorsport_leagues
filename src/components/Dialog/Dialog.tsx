import Button from "../Button/Button";
import {
  DialogViewport,
  DialogWrapper,
  DialogHeader,
  DialogTitle,
  DialogSubtitle,
  DialogActions,
} from "./Dialog.styles";
import { dialogStyles, type DialogType } from "./Dialog.variants";

// TODO: Add logic to handle open/close

type DialogProps = {
  type: DialogType;
  title: string;
  subtitle?: string;
  buttons?: {
    onCancel?: {
      label: string;
      action?: () => void;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
    };
    onContinue?: {
      label: string;
      action?: () => void;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      loading?: boolean;
      loadingText?: string;
      isDanger?: boolean;
    };
  };
};

const Dialog = ({ type = "core", title, subtitle, buttons }: DialogProps) => {
  const typeStyle = dialogStyles[type];

  return (
    <DialogViewport>
      <DialogWrapper $typeStyle={typeStyle}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && <DialogSubtitle>{subtitle}</DialogSubtitle>}
        </DialogHeader>
        <DialogActions>
          {buttons?.onCancel && (
            <Button
              color="base"
              variant="outlined"
              isLoading={buttons?.onCancel?.loading}
              loadingText={buttons?.onCancel?.loadingText}
              icon={{
                left: buttons?.onCancel?.leftIcon,
                right: buttons?.onCancel?.rightIcon,
              }}
              onClick={buttons?.onCancel?.action}
            >
              {buttons?.onCancel?.label}
            </Button>
          )}
          {buttons?.onContinue && (
            <Button
              onClick={buttons?.onContinue?.action}
              icon={{
                left: buttons?.onContinue?.leftIcon,
                right: buttons?.onContinue?.rightIcon,
              }}
              isLoading={buttons?.onContinue?.loading}
              loadingText={buttons?.onContinue?.loadingText}
              color={buttons?.onContinue?.isDanger ? "danger" : "system"}
            >
              {buttons?.onContinue?.label}
            </Button>
          )}
        </DialogActions>
      </DialogWrapper>
    </DialogViewport>
  );
};

export default Dialog;
