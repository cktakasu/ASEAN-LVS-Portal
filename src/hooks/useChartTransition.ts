/* ------------------------------------------------------------------ */
/*  Custom Hooks                                                       */
/* ------------------------------------------------------------------ */

import { useState, useCallback } from "react";

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

  const triggerTransition = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [transitionDuration]);

  return [isTransitioning, transitionClass, triggerTransition];
};
