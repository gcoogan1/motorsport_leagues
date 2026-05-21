import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

// Hook for managing an Embla carousel instance and its state, including selected index, scroll snaps, and navigation controls.

type UseCarouselProps = {
  loop?: boolean;
};

export const useCarousel = ({
  loop = false,
}: UseCarouselProps = {}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  /**
   * Derived (no state needed)
   * Embla snap list only changes on reInit
   */
  const scrollSnaps = useMemo(() => {
    return emblaApi?.scrollSnapList() ?? [];
  }, [emblaApi]);

  /**
   * Sync function (safe to reuse everywhere)
   */
  const sync = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  /**
   * Attach Embla listeners
   * IMPORTANT: no synchronous setState during effect init
   */
  useEffect(() => {
    if (!emblaApi) return;

    // initial sync (deferred to avoid React strict lint warning)
    const id = requestAnimationFrame(sync);

    emblaApi.on("select", sync);
    emblaApi.on("reInit", sync);

    return () => {
      cancelAnimationFrame(id);
      emblaApi.off("select", sync);
      emblaApi.off("reInit", sync);
    };
  }, [emblaApi, sync]);

  /**
   * Actions
   */
  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return {
    emblaRef,
    emblaApi,

    selectedIndex,
    scrollSnaps,

    canScrollPrev,
    canScrollNext,

    scrollPrev,
    scrollNext,
    scrollTo,
  };
};