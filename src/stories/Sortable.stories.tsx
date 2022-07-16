import { ComponentStory, ComponentMeta } from "@storybook/react";
import { zipWith } from "ramda";
import { useEffect, useState } from "react";
import { DraggableBox } from "../components/DraggableBox";
import { DroppableContainer } from "../components/DroppableContainer";
import { SortableContainer } from "../components/SortableContainer";
import { DndConnector } from "../decorators/dndConnection";
import { BoundingBox } from "../utils/boundingBox";
import { Point } from "../utils/point";
import { ISortableItem, positionInChain } from "../utils/sortable/sortable";
import { getBoxStyle, stretchStyle } from "../utils/styles";

export default {
  title: "Demo/Sortable",
  parameters: {},
} as ComponentMeta<any>;

const width = 200;

const getItems = (colors: string[], sizes: number[]) =>
  positionInChain(
    zipWith(
      (color, height) => {
        return {
          key: color,
          box: BoundingBox.createByDimensions(0, 0, 200, height),
        };
      },
      colors,
      sizes
    )
  );

function renderer({ key }: ISortableItem) {
  return (
    <div style={{ ...stretchStyle, background: key, cursor: "pointer" }} />
  );
}

export const Only: ComponentStory<any> = () => {
  const items = getItems(
    ["red", "blue", "green", "purple"],
    [50, 150, 150, 150]
  );

  return (
    <SortableContainer
      items={items}
      transitionDuration={300}
      box={BoundingBox.createByDimensions(0, 0, width, 600)}
      style={{ background: "grey" }}
    >
      {renderer}
    </SortableContainer>
  );
};

// const [items1, setItems1] = useState(
//   getItems(["yellow", "black", "lightblue"], [50, 150, 150])
// );
// const [items2, setItems2] = useState(
//   getItems(["orange", "pink", "lightgreen"], [100, 150, 100])
// );

export const Double: ComponentStory<any> = () => {
  const [box, setBox] = useState(
    BoundingBox.createByDimensions(0, 0, width, 200)
  );
  const [isDropping, setIsDropping] = useState(false);

  const [activeOuterIndex, setActiveOuterIndex] = useState(0);

  const item = { key: "orange", box };

  const outerBox1 = BoundingBox.createByDimensions(0, 0, width, 600);
  const outerBox2 = BoundingBox.createByDimensions(700, 0, width, 600);
  const ob = [outerBox1, outerBox2];

  const handleEnd = () => {
    setBox((prevBox) => {
      // тут должен представить всех в одной системе координат

      const realPrevBox =
        activeOuterIndex === -1
          ? prevBox
          : prevBox.shift(ob[activeOuterIndex].origin);

      for (let i = 0; i < ob.length; i++) {
        const outerBox = ob[i];

        if (realPrevBox.intersectionArea(outerBox) > 0) {
          setActiveOuterIndex(i);
          return realPrevBox.shift(ob[i].origin.negate());
        }
      }

      setActiveOuterIndex(-1);
      return realPrevBox;
    });
  };

  useEffect(() => {
    if (activeOuterIndex !== -1) {
      // setTimeout для того, чтобы DOM успел застать два разных состояния
      setTimeout(() => setBox((prevBox) => prevBox.moveTo(Point.nullish)));
      setIsDropping(true);
      setTimeout(() => setIsDropping(false), 300);
    }
  }, [activeOuterIndex]);

  const db = (
    <DraggableBox
      key="lol"
      value={box}
      onChange={setBox}
      onEnd={handleEnd}
      style={
        isDropping
          ? { transitionDuration: "300ms", transitionProperty: "top left" }
          : undefined
      }
    >
      {renderer(item)}
    </DraggableBox>
  );

  return (
    <div style={{ display: "flex", columnGap: 500, position: "relative" }}>
      <div
        style={{
          background: "grey",
          position: "absolute",
          ...getBoxStyle(outerBox1),
        }}
      >
        {activeOuterIndex === 0 && db}
      </div>
      <div
        style={{
          background: "grey",
          position: "absolute",
          ...getBoxStyle(outerBox2),
        }}
      >
        {activeOuterIndex === 1 && db}
      </div>
      {activeOuterIndex === -1 && db}
    </div>
  );
};

const initialItems1 = {
  test_1: BoundingBox.square(0, 0, 50),
  test_2: BoundingBox.square(0, 300, 50),
};

const initialItems2 = {
  test_3: BoundingBox.square(0, 0, 50),
  test_4: BoundingBox.square(0, 300, 50),
};

export const Double2: ComponentStory<any> = () => {
  return (
    <div style={{ display: "flex", columnGap: 300, position: "relative" }}>
      <DndConnector>
        <DroppableContainer id="first" initialItems={initialItems1} />
        <DroppableContainer id="second" initialItems={initialItems2} />
      </DndConnector>
    </div>
  );
};
