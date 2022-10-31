import { useCallback, useState } from "react";
import { DndContainer } from "./entities/dndContainer";
import { IDndResponse, IPreparedDndEvent } from "./index.types";

/** В ответ на dnd-событие оповещает затронутые контейнеры */
export function useDndNotifier() {
  const availableContainers = useState(
    () => new Map<string, DndContainer | null>()
  )[0];
  const visitedContainers = useState(
    () => new Map<string, DndContainer | null>()
  )[0];

  const notifyAboutDrag = useCallback(
    ({
      itemOnViewport: item,
      targetContainer: container,
    }: IPreparedDndEvent): IDndResponse => {
      const previousContainer = visitedContainers.get(item.key);
      visitedContainers.set(item.key, container);

      const isDragOut =
        previousContainer && !previousContainer.isSame(container);

      if (
        isDragOut &&
        previousContainer.isSame(availableContainers.get(item.key))
      ) {
        availableContainers.delete(item.key);
        previousContainer.connection.onDragOut(item.key);
      }

      if (!container) {
        return { canDrop: false };
      }

      const isDragIn = previousContainer !== container;
      const relativeItem = item.placeRelative(container.box);

      if (isDragIn && container.connection.canDrop(relativeItem)) {
        availableContainers.set(item.key, container);
        container.connection.onDragIn(relativeItem);
        return { canDrop: true };
      }

      if (availableContainers.has(item.key)) {
        container.connection.onDragOn(relativeItem);
        return { canDrop: true };
      }

      return { canDrop: false };
    },
    [availableContainers, visitedContainers]
  );

  const notifyAboutDrop = useCallback(
    ({
      itemOnViewport: item,
      targetContainer: container,
    }: IPreparedDndEvent): IDndResponse => {
      visitedContainers.delete(item.key);
      const canDrop = availableContainers.delete(item.key);

      if (!canDrop || !container) {
        return { canDrop: false };
      }

      container.connection.onDropIn(item.placeRelative(container.box));

      return { canDrop: true };
    },
    [availableContainers, visitedContainers]
  );

  return { notifyAboutDrag, notifyAboutDrop } as const;
}
