import { move, propEq, remove, sum } from "ramda";
import {
  insertAccordingToPosition,
  ISortableItem,
  positionInChain,
  moveIndexAccordingToPosition,
} from "./sortable";

// todo: сначала использовать массивы без оптимизаций, потом подумать над тем, как будет быстрее.
export class SortableItemsState {
  constructor(public items: ISortableItem[]) {}

  get totalHeight() {
    return sum(this.items.map(({ box }) => box.height));
  }

  insertAccordingToPosition(item: ISortableItem) {
    return new SortableItemsState(insertAccordingToPosition(item, this.items));
  }

  align() {
    return new SortableItemsState(positionInChain(this.items));
  }

  private findIndex(key: string) {
    return this.items.findIndex(propEq("key", key));
  }

  moveIndexAccordingToPosition(item: ISortableItem) {
    const sourceIndex = this.findIndex(item.key);
    return new SortableItemsState(
      moveIndexAccordingToPosition(
        { sourceIndex, endPoint: item.box.origin },
        this.items
      )
    );
  }

  placeToBottomByKey(key: string) {
    const index = this.findIndex(key);
    return new SortableItemsState(
      move(index, this.items.length - 1, this.items)
    );
  }

  removeByKey(key: string) {
    const index = this.findIndex(key);
    return new SortableItemsState(remove(index, 1, this.items));
  }
}
