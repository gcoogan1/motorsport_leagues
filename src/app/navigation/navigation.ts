import type { NavigateOptions } from "react-router";

let navigateRef: ((to: string, options?: NavigateOptions) => void) | null = null;

export const setNavigate = (navigate: (to: string, options?: NavigateOptions) => void) => {
  navigateRef = navigate;
};

export const navigate = (to: string, options?: NavigateOptions) => {
  navigateRef?.(to, options);
};