import { ComponentStory, ComponentMeta } from "@storybook/react";
import { prop, propEq, sortBy, sum } from "ramda";
import { useCallback, useState } from "react";
import { Draggable } from "../components/Draggable";
import { useTemporarySet } from "../decorators/useTemporarySet";
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
  /** Отпущенные элементы, не завершившие анимацию перемещения */
  const completedItems = useTemporarySet<string>();

  const [values, setValues] = useState(initialState);
  const [movingItem, setMovingItem] =
    useState<{ key: string; point: Point } | null>(null);

  const handleChange = useCallback((key: string, point: Point) => {
    setMovingItem({ key, point });

    setValues((values) => {
      const sourceIndex = values.findIndex(propEq("key", key));

      return reorder({ sourceIndex, point }, values);
    });
  }, []);

  const transitionDuration = 300;

  const handleEnd = useCallback(
    (key: string) => {
      setMovingItem(null);

      completedItems.add(key, transitionDuration);
    },
    [completedItems]
  );

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
        const currentPoint =
          isActive && movingItem.point ? movingItem.point : box.origin;

        const isCompleted = completedItems.has(key);
        const zIndex = isActive ? 2 : isCompleted ? 1 : 0;

        return (
          <Draggable
            key={key}
            value={currentPoint}
            onChange={(point) => handleChange(key, point)}
            onEnd={() => handleEnd(key)}
            style={
              isActive
                ? undefined
                : {
                    transitionDuration: `${transitionDuration}ms`,
                    transitionProperty: "top left",
                  }
            }
          >
            <div
              style={{
                ...getBoxStyle(box.resetOrigin()),
                background: key,
                cursor: "pointer",
                position: "absolute",
                zIndex,
              }}
            />
          </Draggable>
        );
      })}
    </div>
  );
};
