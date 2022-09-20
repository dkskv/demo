import { useCallback, useState } from "react";
import { ISortableItem } from "../utils/sortable/sortable";
import { useActualRef } from "./useActualRef";
import { useTemporarySet } from "./useTemporarySet";

export function useActiveSortableItem(droppingDuration: number) {
  const [activeItem, setActiveItem] = useState<ISortableItem | null>(null);

  const {
    add: addDroppingItem,
    getAddingIndex,
    getSize,
  } = useTemporarySet<string>();

  const dropActiveItem = useCallback(
    (key: string) => {
      setActiveItem(null);
      addDroppingItem(key, droppingDuration);
    },
    [addDroppingItem, droppingDuration]
  );

  const activeItemRef = useActualRef(activeItem);

  const getOverlapIndex = useCallback(
    (key: string) => {
      if (key === activeItemRef.current?.key) {
        return getSize() + 1;
      }

      return getAddingIndex(key) + 1;
    },
    [activeItemRef, getAddingIndex, getSize]
  );

  return {
    activeItem,
    setActiveItem,
    dropActiveItem,
    getOverlapIndex,
  } as const;
}
