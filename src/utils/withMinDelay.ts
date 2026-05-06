
// Utility to ensure a promise takes at least a minimum amount of time to resolve
// This is used for UX purposes, e.g., to prevent flickering loading states

export const withMinDelay = async <T,>(
  promise: Promise<T>,
  minDelayMs = 1000
): Promise<T> => {
  const delay = new Promise((resolve) => setTimeout(resolve, minDelayMs));

  try {
    const result = await promise;
    await delay;
    return result;
  } catch (error) {
    await delay;
    throw error;
  }
};
