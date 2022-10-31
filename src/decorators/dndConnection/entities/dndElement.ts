import { BoundingBox } from "../../../entities/boundingBox";

export class DndElement {
  constructor(public key: string, public box: BoundingBox) {}

  placeRelative(targetBox: BoundingBox) {
    return this.replaceBox(targetBox.placeInside(this.box));
  }

  replaceBox(box: BoundingBox) {
    return new DndElement(this.key, box);
  }
}
