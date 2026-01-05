import { topFadeBorder } from "@/app/design/mixens/edgeFadeBorder";
import { designTokens } from "@/app/design/tokens";

const { gradients, borders} = designTokens;

export type DialogType = 'core' | 'alert' | 'success';

export const dialogStyles = {
  core: topFadeBorder({ gradient: gradients.base.fadeOutHorizontal80, width: borders.width.medium }),
  alert: topFadeBorder({ gradient: gradients.alert.fadeOutHorizontal80, width: borders.width.medium }),
  success: topFadeBorder({ gradient: gradients.success.fadeOutHorizontal80, width: borders.width.medium }),
};

