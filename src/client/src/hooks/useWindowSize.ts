import { useEffect, useState } from "react";

export type Size = {
  width: number;
  height: number;
};

export const useWindowSize = (): Size | undefined => {
  const [windowSize, setWindowSize] = useState<Size | undefined>();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
