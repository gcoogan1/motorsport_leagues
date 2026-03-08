import { useEffect } from "react";

let activeLocks = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";

// Hook to lock body scroll, useful for modals and side panels. Supports multiple locks and ensures scroll is only re-enabled when all locks are released.
export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const html = document.documentElement;

    // If this is the first lock, store the original overflow values
    if (activeLocks === 0) {
      originalBodyOverflow = body.style.overflow;
      originalHtmlOverflow = html.style.overflow;
    }

    // Increment the active lock count and apply overflow hidden to lock scroll
    activeLocks += 1;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    // Return a cleanup function that will decrement the lock count and restore overflow when all locks are released
    return () => {
      activeLocks = Math.max(0, activeLocks - 1);

      if (activeLocks === 0) {
        body.style.overflow = originalBodyOverflow;
        html.style.overflow = originalHtmlOverflow;
      }
    };
  }, [locked]);
};