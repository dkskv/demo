import { path } from "ramda";
import { BoundingBox } from "../boundingBox";
import { Point } from "../point";
import { defineTargetIndex, positionInChain } from "./sortable";

describe("positionInChain", () => {
  function testPositioning(heights: number[], expectedYs: number[]) {
    const items = heights.map((h) => ({
      key: String(),
      box: BoundingBox.fromOrigin(0, h),
    }));

    const ys = positionInChain(items).map(path(["box", "y0"]));

    expect(ys).toEqual(expectedYs);
  }

  it("case 1", () => {
    testPositioning([20, 40, 20], [0, 20, 60]);
  });

  it("case 2", () => {
    testPositioning([20, 0, 1000], [0, 20, 20]);
  });
});

describe("defineTargetIndex", () => {
  const items = [
    BoundingBox.createByDimensions(0, 0, 0, 20),
    BoundingBox.createByDimensions(0, 20, 0, 40),
    BoundingBox.createByDimensions(0, 60, 0, 20),
    BoundingBox.createByDimensions(0, 80, 0, 50),
    BoundingBox.createByDimensions(0, 130, 0, 10),
  ].map((box) => ({ key: String(), box }));

  function testMoving(sourceIndex: number, expectedIndex: number, y: number) {
    const action = { sourceIndex, point: new Point(0, y) };
    const resultIndex = defineTargetIndex(action, items);

    expect(resultIndex).toEqual(expectedIndex);
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
