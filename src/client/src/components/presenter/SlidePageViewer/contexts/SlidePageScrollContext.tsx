import { FC, ReactNode, createContext, useCallback } from "react";

export type SlidePageScrollContext = {
  createPageId?: (page: number) => string;
  scrollTo?: (page: number) => void;
};

export const SlidePageScrollContext = createContext<SlidePageScrollContext>({});

export const SlidePageScrollContextProvider: FC<{
  scrollOffset: number;
  children: ReactNode;
}> = ({ scrollOffset, children }) => {
  const scrollElement = useCallback(
    (element: HTMLElement) => {
      const parent = element.parentElement;
      if (parent == null) return;

      const offsetPosition =
        element.offsetTop - scrollOffset - parent.offsetTop;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    },
    [scrollOffset]
  );

  const createPageId = useCallback((page: number) => `page-${page}`, []);

  const scrollTo = useCallback(
    (page: number) => {
      const id = createPageId(page);
      const element = document.getElementById(id);
      if (element != null) {
        scrollElement(element);
      }
    },
    [createPageId, scrollElement]
  );

  return (
    <SlidePageScrollContext.Provider value={{ createPageId, scrollTo }}>
      {children}
    </SlidePageScrollContext.Provider>
  );
};
