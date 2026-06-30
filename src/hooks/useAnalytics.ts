import ReactGA from 'react-ga4';

// export const useAnalytics = () => {
//   const track = (action: string, label: string, category = 'Homepage') => {
//     ReactGA.event({ category, action, label });
//   };

//   return { track };
// };

interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

export const useAnalytics = () => {
  /**
   * Tracks a custom GA4 event.
   * @param eventName - The specific interaction name (e.g., 'sign_up_initiated')
   * @param params - Optional object containing breakdown metrics (e.g., { cta_position: 'hero' })
   */
  const track = (eventName: string, params?: AnalyticsParams) => {
    ReactGA.event(eventName, {
      ...params,
      // Optional: Globally inject the current page context if needed
      page_section: params?.page_section || 'Homepage' 
    });
  };

  return { track };
};