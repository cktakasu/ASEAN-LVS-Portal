/* ------------------------------------------------------------------ */
/*  Custom Hooks                                                       */
/* ------------------------------------------------------------------ */

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * チャートY軸トランジション管理フック
 *
 * @param transitionDuration - トランジション時間（ms）
 * @returns [isTransitioning, transitionClass, triggerTransition]
 */
export const useChartTransition = (
  transitionDuration: number = 400
): [boolean, string, () => void] => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionClass = isTransitioning ? "fading" : "";
  const timeoutRef = useRef<number | null>(null);

  const triggerTransition = useCallback(() => {
    setIsTransitioning(true);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      timeoutRef.current = null;
    }, transitionDuration);
  }, [transitionDuration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [isTransitioning, transitionClass, triggerTransition];
};
