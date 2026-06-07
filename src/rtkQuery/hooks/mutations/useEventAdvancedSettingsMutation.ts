import { useCreateEventAdvancedSettingsMutation, useDeleteEventAdvancedSettingsMutation, useUpdateEventAdvancedSettingsMutation } from "@/rtkQuery/API/eventAdvancedSettingsApi";

export const useCreateEventAdvancedSettings = () => {
  return useCreateEventAdvancedSettingsMutation();
}

export const useUpdateEventAdvancedSettings = () => {
  return useUpdateEventAdvancedSettingsMutation();
}

export const useDeleteEventAdvancedSettings = () => {
  return useDeleteEventAdvancedSettingsMutation();
}