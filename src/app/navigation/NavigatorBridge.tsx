import { useEffect } from "react";
import { useNavigate } from "react-router";

// Allows passing the navigate functiion to all components outside of the router

type Props = {
  onReady: (navigate: (to: string) => void) => void;
};

const NavigatorBridge = ({ onReady }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    onReady(navigate);
  }, [navigate, onReady]);

  return null;
};

export default NavigatorBridge;
