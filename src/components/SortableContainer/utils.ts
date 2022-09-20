import { move, propEq, remove, sum } from "ramda";
import {
  insertNear,
  ISortableItem,
  positionInChain,
  reorder,
} from "../../utils/sortable/sortable";

// todo: сначала использовать массивы без оптимизаций, потом подумать над тем, как будет быстрее.
export class SortableItemsState {
  constructor(public items: ISortableItem[]) {}

  get totalHeight() {
    return sum(this.items.map(({ box }) => box.height));
  }

  insert(item: ISortableItem) {
    return new SortableItemsState(insertNear(item, this.items));
  }

  align() {
    return new SortableItemsState(positionInChain(this.items));
  }

  private findIndex(key: string) {
    return this.items.findIndex(propEq("key", key));
  }

  relocate(item: ISortableItem) {
    const sourceIndex = this.findIndex(item.key);
    return new SortableItemsState(
      reorder({ sourceIndex, point: item.box.origin }, this.items)
    );
  }

  lower(key: string) {
    const index = this.findIndex(key);
    return new SortableItemsState(
      move(index, this.items.length - 1, this.items)
    );
  }

  remove(key: string) {
    const index = this.findIndex(key);
    return new SortableItemsState(remove(index, 1, this.items));
  }
}
