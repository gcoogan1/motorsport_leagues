import { useEffect, useState } from "react";

// Hook to determine if a media query matches

// USAGE to match layout tokens: 
// const isMobile = useMediaQuery("(max-width: 919px)");
// const isLargeScreen = useMediaQuery('(min-width: 920px)');

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}