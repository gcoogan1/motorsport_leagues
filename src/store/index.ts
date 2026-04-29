import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/account.slice";
import leagueReducer from "./leagues/league.slice";
import profileReducer from "./profile/profile.slice";
import squadReducer from "./squads/squad.slice";
import { leagueApi } from "../rtkQuery/API/leagueApi";
import { notificationApi } from "../rtkQuery/API/notificationApi";
import { profileApi } from "../rtkQuery/API/profileApi";
import { squadApi } from "../rtkQuery/API/squadApi";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    league: leagueReducer,
    profile: profileReducer,
    squad: squadReducer,
    [leagueApi.reducerPath]: leagueApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [squadApi.reducerPath]: squadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      leagueApi.middleware,
      notificationApi.middleware,
      profileApi.middleware,
      squadApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;