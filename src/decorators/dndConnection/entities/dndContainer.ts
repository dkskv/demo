import { always } from "ramda";
import { BoundingBox } from "../../../entities/boundingBox";
import { noop } from "../../../utils/common";
import { IDndConnection } from "../index.types";

export class DndContainer {
  public connection: IDndConnection = {
    onDragIn: noop,
    onDragOn: noop,
    onDropIn: noop,
    onDragOut: noop,
    canDrop: always(false),
  };

  constructor(public key: string, public box: BoundingBox) {}

  updateConnection(connection: Partial<IDndConnection>) {
    this.connection = { ...this.connection, ...connection };
  }

  isOverlapWith(box: BoundingBox) {
    return this.box.intersectionArea(box) > 0;
  }

  isSame(other: DndContainer | null | undefined) {
    return other && this.key === other.key;
  }
}
