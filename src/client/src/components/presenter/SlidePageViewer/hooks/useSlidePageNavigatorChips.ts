export const useSlidePageNavigatorChips = (
  rootRef: HTMLElement | null,
  entry?: IntersectionObserverEntry
) => {
  const target =
    entry?.target instanceof HTMLElement ? entry.target : undefined;

  const hasTarget = rootRef != null && entry != null && target != null;

  const visibleTopChip = hasTarget && rootRef.scrollTop > target.offsetTop;
  const topChipOpacity = visibleTopChip ? 1 - entry.intersectionRatio : 0;

  const visibleBottomChip =
    hasTarget &&
    rootRef.scrollTop + rootRef.offsetHeight <
      target.offsetTop + target.offsetHeight;
  const bottomChipOpacity = visibleBottomChip ? 1 - entry.intersectionRatio : 0;

  return { opacity: { top: topChipOpacity, bottom: bottomChipOpacity } };
};
