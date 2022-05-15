import { useCallback, useEffect } from "react";

export function useWheel(
  element: Element | null,
  onChange: (delta: number) => void
) {
  const handleChange = useCallback(
    (event: Event) => {
      event.stopPropagation();
      event.preventDefault();

      onChange((event as WheelEvent).deltaY);
    },
    [onChange]
  );

  useEffect(() => {
    if (element) {
      element.addEventListener("wheel", handleChange);

      return () => {
        element.removeEventListener("wheel", handleChange);
      };
    }
  }, [element, handleChange]);
}
