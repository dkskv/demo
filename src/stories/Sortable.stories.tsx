import { ComponentStory, ComponentMeta } from "@storybook/react";
import { prop, propEq, sortBy, sum } from "ramda";
import { useCallback, useMemo, useState } from "react";
import { DraggableBox } from "../components/DraggableBox";
import { useTemporarySet } from "../decorators/useTemporarySet";
import { BoundingBox } from "../utils/boundingBox";
import {
  ISortableItem,
  positionInChain,
  reorder,
} from "../utils/sortable/sortable";
import { getBoxStyle, stretchStyle } from "../utils/styles";

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
  /**
   * Отпущенные элементы, не завершившие анимацию перемещения
   * todo: переименовать
   */
  const completedItems = useTemporarySet<string>();

  const [values, setValues] = useState(initialState);
  const [movingItem, setMovingItem] = useState<ISortableItem | null>(null);

  const handleChange = useCallback((key: string, box: BoundingBox) => {
    setMovingItem({ key, box });

    setValues((values) => {
      const sourceIndex = values.findIndex(propEq("key", key));

      return reorder({ sourceIndex, point: box.origin }, values);
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

  /* 
    Сохранение порядка элементов для React, чтобы получить правильную анимацию. 
    Без сортировки элементы резко меняют позицию, несмотря на CSS `transition`.
    todo: Попробовать избавиться.
  */
  const sortedValues = useMemo(() => sortBy(prop("key"), values), [values]);

  return (
    <div
      style={{
        ...getBoxStyle(BoundingBox.createByDimensions(0, 0, width, sum(sizes))),
        background: "grey",
        position: "relative",
      }}
    >
      {sortedValues.map(({ key, box }) => {
        const isActive = movingItem?.key === key;
        const isCompleted = completedItems.has(key);
        const zIndex = isActive ? 2 : isCompleted ? 1 : 0;

        return (
          <DraggableBox
            key={key}
            value={isActive ? movingItem.box : box}
            onChange={(box) => handleChange(key, box)}
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
                ...stretchStyle,
                background: key,
                cursor: "pointer",
                position: "absolute",
                zIndex,
              }}
            />
          </DraggableBox>
        );
      })}
    </div>
  );
};
