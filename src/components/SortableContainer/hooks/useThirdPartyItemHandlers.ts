import { useCallback } from "react";
import { SortableItemsState } from "../utils/sortableItemsState";
import { ISortableItem } from "./../utils/sortable";

interface IParams {
  setOverlayItem(i: ISortableItem | null): void;
  setItemsState(f: (s: SortableItemsState) => SortableItemsState): void;
}

export function useThirdPartyItemHandlers({
  setOverlayItem,
  setItemsState,
}: IParams) {
  const onDragIn = useCallback(
    (item: ISortableItem) => {
      setOverlayItem(item);
      setItemsState((state) => state.insertAccordingToPosition(item).align());
    },
    [setOverlayItem, setItemsState]
  );

  const onDragOut = useCallback(
    (key: string) => {
      setOverlayItem(null);
      setItemsState((state) => state.removeByKey(key).align());
    },
    [setOverlayItem, setItemsState]
  );

  const onDragOn = useCallback(
    (item: ISortableItem) => {
      setOverlayItem(item);
      setItemsState((state) =>
        state.moveIndexAccordingToPosition(item).align()
      );
    },
    [setOverlayItem, setItemsState]
  );

  return { onDragIn, onDragOn, onDragOut } as const;
}
