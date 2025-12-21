import ReactGA from "react-ga4";

import AppRouter from "./routes/AppRouter";

const App = () => {

  // Initialize Google Analytics
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });

  return (
    <div>
      <AppRouter />
    </div>
  );
};

export default App;
