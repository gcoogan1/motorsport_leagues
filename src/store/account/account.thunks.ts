import { createAsyncThunk } from "@reduxjs/toolkit";
import { changeEmail } from "@/services/auth.service";
import { getAccountById, updateAccountName } from "@/services/account.service";
import type { AccountNameUpdatePayload, ChangeEmailPayload } from "@/types/account.types";


export const fetchAccountThunk = createAsyncThunk(
  "account/fetch",
  async (userId: string) => {
    return getAccountById(userId);
  }
);

export const updateAccountNameThunk = createAsyncThunk(
  "account/update",
  async ({
    firstName,
    lastName,
    userId,
  }: AccountNameUpdatePayload) => {
    return updateAccountName(firstName, lastName, userId);
  }
);

// Update both auth email and account email
export const changeEmailThunk = createAsyncThunk(
  "account/changeEmail",
  async ({
    newEmail, userId,
  }: ChangeEmailPayload) => {
    return changeEmail(newEmail, userId);
  })