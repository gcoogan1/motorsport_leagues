import { useGetEventAdvancedSettingsQuery } from "@/rtkQuery/API/eventAdvancedSettingsApi";

export const useGetEventAdvancedSettings = (eventId: string) => {
  return useGetEventAdvancedSettingsQuery(eventId ?? "", {
    skip: !eventId,
  });
}