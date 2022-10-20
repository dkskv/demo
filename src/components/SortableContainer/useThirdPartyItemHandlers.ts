import { useCallback } from "react";
import { SortableItemsState } from "./sortableItemsState";
import { ISortableItem } from "./utils/sortable";

interface IParams {
  setActiveItem(i: ISortableItem | null): void;
  setItemsState(f: (s: SortableItemsState) => SortableItemsState): void;
}

export function useThirdPartyItemHandlers({
  setActiveItem,
  setItemsState,
}: IParams) {
  const onDragIn = useCallback(
    (item: ISortableItem) => {
      setActiveItem(item);
      setItemsState((state) => state.insertAccordingToPosition(item).align());
    },
    [setActiveItem, setItemsState]
  );

  const onDragOut = useCallback(
    (key: string) => {
      setActiveItem(null);
      setItemsState((state) => state.removeByKey(key).align());
    },
    [setActiveItem, setItemsState]
  );

  const onDragOn = useCallback(
    (item: ISortableItem) => {
      setActiveItem(item);
      setItemsState((state) =>
        state.moveIndexAccordingToPosition(item).align()
      );
    },
    [setActiveItem, setItemsState]
  );

  return { onDragIn, onDragOn, onDragOut } as const;
}
