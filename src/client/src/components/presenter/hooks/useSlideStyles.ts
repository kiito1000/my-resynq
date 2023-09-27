import { Size, useResizeObserver } from "@/hooks/useResizeObserver";
import { CSSProperties, MutableRefObject, useMemo } from "react";

const defaultSize: Size = {
  width: 1920,
  height: 1080,
};

export const useSlideStyles = (): {
  ref: MutableRefObject<Element | null>;
  styles: CSSProperties;
} => {
  const { ref, size = defaultSize } = useResizeObserver();
  const isNarrow = size.width / size.height < 16 / 9.0;
  const styles: CSSProperties = useMemo(() => {
    if (isNarrow) {
      return {
        width: 1920,
        height: 1080,
        transform: `scale(${size.width / defaultSize.width})`,
      };
    } else {
      return {
        width: 1920,
        height: 1080,
        transform: `scale(${size.height / defaultSize.height})`,
      };
    }
  }, [isNarrow, size.height, size.width]);

  return { ref, styles };
};
