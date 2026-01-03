import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import CloseIcon from "@assets/Icon/Close.svg?react"
import { toastUsageStyles, type ToastUsage } from "./Toast.variants";
import { ContentContainer, MessageText, ToastContainer, ToastViewport } from "./Toast.styles";

// TODO: Add global state management for toasts (e.g., Redux, Context API) to close and manage multiple toasts

type ToastProps = {
  usage: ToastUsage;
  message: string;
  onClose?: () => void;
}

const Toast = ({ usage, message, onClose }: ToastProps) => {

  const toastBackground = toastUsageStyles[usage].background;
  const toastIcon = toastUsageStyles[usage].icon;

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
  }
  
  return (
    <ToastViewport>
      <ToastContainer $bg={toastBackground}>
      <ContentContainer>
        <Icon>{toastIcon}</Icon>
        <MessageText>{message}</MessageText>
      </ContentContainer>
      <Button size="small" color="base" onClick={handleOnClose} icon={{ right: <CloseIcon /> }}></Button>
    </ToastContainer>
    </ToastViewport>
  )
}

export default Toast