let navigateRef: ((to: string) => void) | null = null;

export const setNavigate = (navigate: (to: string) => void) => {
  navigateRef = navigate;
};

export const navigate = (to: string) => {
  navigateRef?.(to);
};
