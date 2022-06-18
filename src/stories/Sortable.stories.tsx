import { ComponentStory, ComponentMeta } from "@storybook/react";
import { prop, sortBy } from "ramda";
import { useCallback, useState } from "react";
import { Draggable } from "../components/Draggable";
import { BoundingBox } from "../utils/boundingBox";
import { Point } from "../utils/point";
import {
  ISortableItem,
  order,
  positionEntriesInChain,
} from "../utils/sortable/sortable";
import { getBoxStyle } from "../utils/styles";

export default {
  title: "Demo/Sortable",
  parameters: {},
} as ComponentMeta<any>;

const width = 200;

const sizes = [50, 150, 150, 150];
const colors = ["red", "blue", "green", "purple"];
const initialState: ISortableItem[] = positionEntriesInChain(
  colors.map((color, index) => {
    // const height = 50 + Math.random() * 100;
    const height: number = sizes[index];

    return {
      key: color,
      box: BoundingBox.createByDimensions(0, 0, 200, height),
    };
  })
);

export const Only: ComponentStory<any> = (args) => {
  const [values, setValues] = useState(initialState);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<Point | null>(null);

  const handleChange = useCallback((activeKey: string, box: BoundingBox) => {
    setActiveKey(activeKey);
    setActivePoint(box.origin);
    setValues((values) => order(values, { key: activeKey, box }));
  }, []);

  const handleEnd = useCallback((key: string) => {
    setActiveKey(null);
    setActivePoint(null);
  }, []);

  return (
    <div
      style={{
        ...getBoxStyle(BoundingBox.createByDimensions(0, 0, width, 400)),
        background: "grey",
        position: "relative",
      }}
    >
      {sortBy(prop("key"), values).map(({ key, box }) => {
        const isActive = key === activeKey;

        let value: Point;

        if (isActive) {
          value = activePoint ?? box.origin;
        } else {
          value = box.origin;
        }

        return (
          <Draggable
            key={key}
            value={value}
            onChange={(p) => handleChange(key, box.moveTo(p))}
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
