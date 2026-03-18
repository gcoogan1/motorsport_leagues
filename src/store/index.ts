import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/account.slice";
import profileReducer from "./profile/profile.slice";
import squadReducer from "./squads/squad.slice";
import { notificationApi } from "./rtkQueryAPI/notificationApi";
import { profileApi } from "./rtkQueryAPI/profileApi";
import { squadApi } from "./rtkQueryAPI/squadApi";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    profile: profileReducer,
    squad: squadReducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [squadApi.reducerPath]: squadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      notificationApi.middleware,
      profileApi.middleware,
      squadApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;