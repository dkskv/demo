import { path } from "ramda";
import { BoundingBox } from "../../../utils/boundingBox";
import { Point } from "../../../utils/point";
import {
  defineInsertionIndex,
  defineIndexAfterMove,
  positionInChain,
} from "./sortable";

describe("Определение индекса для вставки нового элемента", () => {
  const items = [
    BoundingBox.square(0, 0, 20),
    BoundingBox.square(0, 20, 40),
    BoundingBox.square(0, 60, 20),
    BoundingBox.square(0, 80, 50),
    BoundingBox.square(0, 130, 10),
  ].map((box) => ({ key: String(), box }));

  function testCase(box: BoundingBox, expectedIndex: number) {
    expect(defineInsertionIndex({ key: "", box }, items)).toBe(expectedIndex);
  }

  const cases = [
    [BoundingBox.square(0, -10, 10), 0],
    [BoundingBox.square(0, 4, 10), 0],
    [BoundingBox.square(0, 22, 16), 1],
    [BoundingBox.square(0, 65, 20), 3],
    [BoundingBox.square(0, 126, 10), 4],
    [BoundingBox.square(0, 130, 30), 5],
  ] as const;

  cases.forEach(([box, expectedIndex], caseIndex) => {
    it(`case ${caseIndex + 1}`, () => {
      testCase(box, expectedIndex);
    });
  });
});

describe("Позиционирование элементов в соответствии с их индексами", () => {
  function testPositioning(heights: number[], expectedYs: number[]) {
    const items = heights.map((h) => ({
      key: String(),
      box: BoundingBox.byOnlyDeltas(0, h),
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

describe("Определение нового индекса элемента после его перемещения", () => {
  const items = [
    BoundingBox.byDeltas(0, 0, 0, 20),
    BoundingBox.byDeltas(0, 20, 0, 40),
    BoundingBox.byDeltas(0, 60, 0, 20),
    BoundingBox.byDeltas(0, 80, 0, 50),
    BoundingBox.byDeltas(0, 130, 0, 10),
  ].map((box) => ({ key: String(), box }));

  function testMoving(sourceIndex: number, expectedIndex: number, y: number) {
    const action = { sourceIndex, point: new Point(0, y) };
    const resultIndex = defineIndexAfterMove(action, items);

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
