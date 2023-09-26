import { useRef } from "react";
import { MutableRefObject } from "react";
import { useMemo } from "react";
import { useEffect, useState } from "react";

export type Size = {
  width: number;
  height: number;
};

export const useResizeObserver = (): {
  ref: MutableRefObject<Element | null>;
  size?: Size;
} => {
  const ref = useRef<Element | null>(null);
  const [size, setSize] = useState<Size | undefined>();

  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        if (entries[0]?.contentRect) {
          setSize({
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height,
          });
        }
      }),
    []
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [observer]);

  return { ref, size };
};
