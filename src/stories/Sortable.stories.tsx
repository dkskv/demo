import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useCallback, useState } from "react";
import { Draggable } from "../components/Draggable";
import { BoundingBox } from "../utils/boundingBox";
import { Point } from "../utils/point";
import { getBoxStyle } from "../utils/styles";

export default {
  title: "Demo/Sortable",
  parameters: {},
} as ComponentMeta<any>;

const width = 200;

// Начальное состояние

interface IEntry {
  key: string;
  box: BoundingBox;
}

const sizes = [50, 150, 150, 150];
const colors = ["red", "blue", "green", "purple"];
const initialState: IEntry[] = positionInChain(
  colors.map((color, index) => {
    // const height = 50 + Math.random() * 100;
    const height = sizes[index];

    return {
      key: color,
      box: BoundingBox.createByDimensions(0, 0, 200, height),
    };
  })
);

function positionInChain(
  entries: IEntry[] /*, startIndex: number, endIndex: number */
) {
  const nextEntries: IEntry[] = [];
  let lastY = 0;

  for (const entry of entries) {
    const { key, box } = entry;
    nextEntries.push({ key, box: box.moveTo(new Point(box.x0, lastY)) });

    lastY += box.height;
  }

  return nextEntries;
}

function move<T>(arr: T[], from: number, to: number) {
  // return arr.splice(to, 0, arr.splice(from, 1)[0]);

  if (from === to) {
    return;
  }

  const saved = arr[from];
  const dir = Math.sign(to - from);

  for (let i = from; i !== to; i += dir) {
    arr[i] = arr[i + dir];
  }

  arr[to] = saved;
}

export const Only: ComponentStory<any> = (args) => {
  // const arr = [1, 2, 3, 4, 5, 6];
  // move(arr, 5, 2);
  // console.log(arr);

  const [values, setValues] = useState(initialState);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  const handleChange = useCallback((activeKey: string, point: Point) => {
    setActiveKey(activeKey);
    setActivePoint(point);

    setValues((values) => {
      const activeIndex = values.findIndex(({ key }) => key === activeKey);
      const activeBox = values[activeIndex].box.moveTo(point);

      let targetIndex = values.findIndex((entry, index) => {
        if (index === activeIndex) {
          return false;
        }

        const { ysRange } = entry.box;
        const boxCenterY = ysRange.denormalizeNumber(0.5);
        const { y1, y2 } = activeBox;

        console.log(y1, y2);

        const n = 3;

        // Вытеснение верхней стороной
        if (ysRange.includes(y1) && y1 < boxCenterY + n /* && activeIndex > index */) {
          console.log("я вахуе");
          return true;
        }

        // Вытеснение нижней стороной
        if (ysRange.includes(y2) && y2 > boxCenterY + n /* && activeIndex < index */) {
          console.log("схуяле, ведь", `${y2} > ${boxCenterY + n}`);
          return true;
        }

        return false;
      });

      if (targetIndex === -1) {
        // targetIndex = point.y < values[0].box.y0 ? 0 : values.length - 1;
        targetIndex = activeIndex;
      }

      if (activeIndex === targetIndex) {
        return values;
      }

      const nextValues = [...values];
      move(nextValues, activeIndex, targetIndex);

      return positionInChain(nextValues);
    });
  }, []);

  const handleEnd = useCallback((key: string) => {
    setActiveKey(null);
    setActivePoint(null);

    // setValues((obj) => {

    // });
  }, []);

  return (
    <div
      style={{
        ...getBoxStyle(BoundingBox.createByDimensions(0, 0, width, 400)),
        background: "grey",
        position: "relative",
      }}
    >
      {values.map(({ key, box }) => {
        const isActive = key === activeKey;

        let value: Point;

        if (isActive) {
          value = activePoint ?? box.origin;
        } else {
          value = box.origin;
        }

        return (
          <Draggable
            value={value}
            onChange={(p) => handleChange(key, p)}
            onEnd={() => handleEnd(key)}
            style={isActive ? undefined : { transition: "top 300ms ease" }}
          >
            <div
              style={{
                ...getBoxStyle(box.resetOrigin()),
                background: key,
                cursor: "pointer",
                position: "absolute",
                zIndex: isActive ? 1 : 0,
              }}
            />
          </Draggable>
        );
      })}
    </div>
  );
};
