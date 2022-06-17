import { move } from "ramda";
import { BoundingBox } from "../boundingBox";
import { Point } from "../point";
import { ISortableItem, order, positionInChain } from "./sortable";

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

describe("order", () => {
  const items = [
    { key: "0", box: BoundingBox.createByDimensions(0, 0, 0, 20) },
    { key: "1", box: BoundingBox.createByDimensions(0, 20, 0, 40) },
    { key: "2", box: BoundingBox.createByDimensions(0, 60, 0, 20) },
    { key: "3", box: BoundingBox.createByDimensions(0, 80, 0, 50) },
    { key: "4", box: BoundingBox.createByDimensions(0, 130, 0, 10) },
  ];

  function testMoving(index: number, targetIndex: number, y: number) {
    function extractKeys(items: ISortableItem[]) {
      return items.map(({ key }) => key);
    }

    const { key, box } = items[index];
    const movableBox = box.moveTo(new Point(0, y));

    expect(extractKeys(order(items, { key, box: movableBox }))).toEqual(
      extractKeys(move(index, targetIndex, items))
    );
  }

  it("case 1", () => {
    testMoving(4, 2, 68);
  });

  it("case 2", () => {
    testMoving(4, 3, 74);
  });

  it("case 3", () => {
    testMoving(4, 0, -10);
  });

  it("case 4", () => {
    testMoving(2, 2, 80);
  });

  it("case 5", () => {
    testMoving(2, 3, 87);
  });

  it("case 6", () => {
    testMoving(0, 4, 125);
  });
});
