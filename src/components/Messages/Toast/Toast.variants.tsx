import type { JSX } from "react";
import type { ToastUsage } from "@/types/toast.types";
import Info_Filled from "@assets/Icon/Information_Filled.svg?react";
import Check_Filled from "@assets/Icon/Check_Circle_Filled.svg?react";
import Error_Filled from "@assets/Icon/Error_Filled.svg?react";
import { designTokens } from "@/app/design/tokens";

const { colors } = designTokens;


export const toastUsageStyles: Record<ToastUsage, { background: string; icon: JSX.Element }> = {
  success: {
    background: colors.utility.success,
    icon: <Check_Filled />,
  },
  error: {
    background: colors.alert.alertA,
    icon: <Error_Filled />,
  },
  info: {
    background: colors.base.base3,
    icon: <Info_Filled />,
  },
} as const;
