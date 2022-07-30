import { move, propEq, remove } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Emitter } from "../utils/emitter";
import {
  insertNear,
  ISortableItem,
  positionInChain,
  reorder,
} from "../utils/sortable/sortable";
import { useActualRef } from "./useActualRef";
import { useTemporarySet } from "./useTemporarySet";

class SortableManager extends Emitter<ISortableItem[]> {
  constructor(private items: ISortableItem[]) {
    super();
  }

  private notify() {
    this.emit(this.items);
  }

  insert(item: ISortableItem) {
    this.items = insertNear(item, this.items);
    this.notify();
  }

  has(key: string): boolean {
    return !!this.items.find((item) => key === item.key);
  }

  relocate(item: ISortableItem) {
    const sourceIndex = this.findIndex(item.key);
    this.items = reorder({ sourceIndex, point: item.box.origin }, this.items);
    this.notify();
  }

  lower(key: string) {
    const index = this.findIndex(key);
    this.items = move(index, this.items.length - 1, this.items);
    this.notify();
  }

  remove(key: string) {
    const index = this.findIndex(key);
    this.items = remove(index, 1, this.items);
    this.notify();
  }

  align() {
    this.items = positionInChain(this.items);
    this.notify();
  }

  private findIndex(key: string) {
    return this.items.findIndex(propEq("key", key));
  }
}

// Сначала использовать массивы без оптимизаций, потом подумать над тем, как будет быстрее.
export function useSortableItems(initialItems: ISortableItem[]) {
  const manager = useMemo(
    () => new SortableManager(initialItems),
    [initialItems]
  );

  const [items, setItems] = useState<ISortableItem[]>(initialItems);

  useEffect(() => manager.subscribe(setItems), [manager]);

  return [items, manager] as const;
}

export function useActiveSortableItem(droppingDuration: number) {
  const [activeItem, setActiveItem] = useState<ISortableItem | null>(null);

  const {
    add: addDroppingItem,
    getAddingIndex,
    getSize,
  } = useTemporarySet<string>();

  const successfullyDrop = useCallback(
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
    successfullyDrop,
    getOverlapIndex,
  } as const;
}
