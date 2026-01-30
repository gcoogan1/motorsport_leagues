import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/account.slice";
import profileReducer from "./profile/profile.slice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;