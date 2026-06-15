import ReactGA from 'react-ga4';

export const useAnalytics = () => {
  const track = (action: string, label: string, category = 'Homepage') => {
    ReactGA.event({ category, action, label });
  };

  return { track };
};