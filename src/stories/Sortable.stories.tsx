import { ComponentStory, ComponentMeta } from "@storybook/react";
import { prop, propEq, sortBy, sum } from "ramda";
import { useCallback, useState } from "react";
import { Draggable } from "../components/Draggable";
import { BoundingBox } from "../utils/boundingBox";
import { Point } from "../utils/point";
import {
  ISortableItem,
  positionInChain,
  reorder,
} from "../utils/sortable/sortable";
import { getBoxStyle } from "../utils/styles";

export default {
  title: "Demo/Sortable",
  parameters: {},
} as ComponentMeta<any>;

const width = 200;

const sizes = [50, 150, 150, 150];
const colors = ["red", "blue", "green", "purple"];
const initialState: ISortableItem[] = positionInChain(
  colors.map((color, index) => {
    const height: number = sizes[index];

    return {
      key: color,
      box: BoundingBox.createByDimensions(0, 0, 200, height),
    };
  })
);

export const Only: ComponentStory<any> = () => {
  const [values, setValues] = useState(initialState);
  const [movingItem, setMovingItem] =
    useState<{ key: string; point: Point } | null>(null);

  const handleChange = useCallback((key: string, point: Point) => {
    setMovingItem({ key, point });

    setValues((values) => {
      const sourceIndex = values.findIndex(propEq("key", key));
      const action = { sourceIndex, point };

      return reorder(action, values);
    });
  }, []);

  const handleEnd = useCallback((key: string) => {
    setMovingItem(null);
  }, []);

  return (
    <div
      style={{
        ...getBoxStyle(BoundingBox.createByDimensions(0, 0, width, sum(sizes))),
        background: "grey",
        position: "relative",
      }}
    >
      {sortBy(prop("key"), values).map(({ key, box }) => {
        const isActive = movingItem?.key === key;

        let value: Point;

        if (isActive) {
          value = movingItem.point ?? box.origin;
        } else {
          value = box.origin;
        }

        return (
          <Draggable
            key={key}
            value={value}
            onChange={(point) => handleChange(key, point)}
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
