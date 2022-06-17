import { BoundingBox } from "../boundingBox";
import { Point } from "../point";
import { positionInChain } from "./sortable";

describe("positionInChain", () => {
  it("case 1", () => {
    const b1 = BoundingBox.fromOrigin(0, 20);
    const b2 = BoundingBox.fromOrigin(0, 40);
    const b3 = BoundingBox.fromOrigin(0, 20);

    expect(positionInChain([b1, b2, b3])).toEqual([
      b1,
      b2.moveTo(new Point(0, 20)),
      b3.moveTo(new Point(0, 60)),
    ]);
  });

  it("case 2", () => {
    const b1 = BoundingBox.fromOrigin(0, 20);
    const b2 = BoundingBox.fromOrigin(0, 0);
    const b3 = BoundingBox.fromOrigin(0, Infinity);

    expect(positionInChain([b1, b2, b3])).toEqual([
      b1,
      b2.moveTo(new Point(0, 20)),
      b3.moveTo(new Point(0, 20)),
    ]);
  });
});
