// --- Mutations --- //
// Used to modify data //

import { useCreateResultMutation, useUpdateResultMutation, useDeleteResultMutation } from "@/rtkQuery/API/resultsApi";

export const useCreateResult = () => {
  return useCreateResultMutation();
};

export const useUpdateResult = () => {
  return useUpdateResultMutation();
};

export const useDeleteResult = () => {
  return useDeleteResultMutation();
};