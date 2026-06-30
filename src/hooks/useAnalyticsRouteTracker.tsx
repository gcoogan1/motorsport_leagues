import { useEffect } from "react";
import { useLocation } from "react-router";
import ReactGA from "react-ga4";

export const AnalyticsRouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // This executes automatically every time the route path or query parameters shift
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
};
