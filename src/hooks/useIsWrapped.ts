import { useState, useLayoutEffect, useRef, type RefObject } from "react";

// A hook that tracks if the height of a DOM element exceeds a given threshold.
// In this case, it can be used to determine if the content is wrapped onto multiple lines.
export function useIsWrapped<T extends HTMLElement>(
  threshold: number
): [RefObject<T | null>, boolean] {
  const [isWrapped, setIsWrapped] = useState<boolean>(false);
  const targetRef = useRef<T>(null);

  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      // Use the first entry (the observed element)
      const entry = entries[0];
      if (!entry) return;

      const currentHeight =
        entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height;
      const exceeds = currentHeight > threshold;

      setIsWrapped((prev) => (prev !== exceeds ? exceeds : prev));
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [threshold]);

  return [targetRef, isWrapped];
}
