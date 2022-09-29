import { useCallback, useRef } from "react";
import { SortableItemsState } from "./sortableItemsState";
import { ISortableItem } from "./utils/sortable";

interface IParams {
  setActiveItem(i: ISortableItem | null): void;
  dropActiveItem(): void;
  setItemsState(d: (s: SortableItemsState) => SortableItemsState): void;
  checkIsEnoughSpace(i: ISortableItem): boolean;
}

export function useThirdPartyItemHandlers({
  setActiveItem,
  dropActiveItem,
  setItemsState,
  checkIsEnoughSpace,
}: IParams) {
  const isAccepting = useRef(false);

  const onDragIn = useCallback(
    (item: ISortableItem, isFirstEvent: boolean) => {
      if (isFirstEvent) {
        isAccepting.current = checkIsEnoughSpace(item);
      }

      if (!isAccepting.current) {
        return { canBeInserted: false };
      }

      setItemsState((state) =>
        isFirstEvent
          ? state.insertAccordingToPosition(item).align()
          : state.moveIndexAccordingToPosition(item).align()
      );

      setActiveItem(item);

      return { canBeInserted: true };
    },
    [setActiveItem, setItemsState, checkIsEnoughSpace]
  );

  const onDropIn = useCallback(() => {
    if (isAccepting.current) {
      dropActiveItem();
    }

    return { canBeInserted: isAccepting.current };
  }, [dropActiveItem]);

  const onDragOut = useCallback(
    (key: string) => {
      if (!isAccepting.current) {
        return;
      }

      isAccepting.current = false;
      setActiveItem(null);
      setItemsState((state) => state.removeByKey(key).align());
    },
    [setActiveItem, setItemsState]
  );

  return { onDragIn, onDropIn, onDragOut } as const;
}
