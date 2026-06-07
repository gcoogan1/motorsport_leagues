import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/account.slice";
import leagueReducer from "./leagues/league.slice";
import profileReducer from "./profile/profile.slice";
import squadReducer from "./squads/squad.slice";
import { eventApi } from "../rtkQuery/API/eventApi";
import { leagueApi } from "../rtkQuery/API/leagueApi";
import { notificationApi } from "../rtkQuery/API/notificationApi";
import { profileApi } from "../rtkQuery/API/profileApi";
import { roundApi } from "../rtkQuery/API/roundApi";
import { squadApi } from "../rtkQuery/API/squadApi";
import { carsApi } from "@/rtkQuery/API/carsApi";
import { eventAdvancedSettingsApi } from "@/rtkQuery/API/eventAdvancedSettingsApi";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    league: leagueReducer,
    profile: profileReducer,
    squad: squadReducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [leagueApi.reducerPath]: leagueApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [roundApi.reducerPath]: roundApi.reducer,
    [squadApi.reducerPath]: squadApi.reducer,
    [carsApi.reducerPath]: carsApi.reducer,
    [eventAdvancedSettingsApi.reducerPath]: eventAdvancedSettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      eventApi.middleware,
      leagueApi.middleware,
      notificationApi.middleware,
      profileApi.middleware,
      roundApi.middleware,
      squadApi.middleware,
      carsApi.middleware,
      eventAdvancedSettingsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;