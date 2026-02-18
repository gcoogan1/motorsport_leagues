import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/account.slice";
import profileReducer from "./profile/profile.slice";
import { profileApi } from "./rtkQueryAPI/profileApi";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    profile: profileReducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;