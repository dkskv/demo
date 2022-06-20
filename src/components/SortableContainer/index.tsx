import { prop, propEq, sortBy } from "ramda";
import { useCallback, useMemo, useState } from "react";
import { useTemporarySet } from "../../decorators/useTemporarySet";
import { BoundingBox } from "../../utils/boundingBox";
import { ISortableItem, reorder } from "../../utils/sortable/sortable";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";

interface IProps {
  box: BoundingBox;
  items: ISortableItem[];
  /** Время анимации в ms */
  transitionDuration?: number;
  style?: React.CSSProperties;
  /** Item renderer */
  children(item: ISortableItem): React.ReactNode;
}

export const SortableContainer: React.FC<IProps> = ({
  box,
  items,
  transitionDuration = 0,
  style,
  children: renderItem,
}) => {
  /**
   * Отпущенные элементы, не завершившие анимацию перемещения.
   * todo: переименовать.
   */
  const completedItems = useTemporarySet<string>();

  const [values, setValues] = useState(items);
  const [movingItem, setMovingItem] = useState<ISortableItem | null>(null);

  const handleChange = useCallback((item: ISortableItem) => {
    setMovingItem(item);

    setValues((values) => {
      const sourceIndex = values.findIndex(propEq("key", item.key));

      return reorder({ sourceIndex, point: item.box.origin }, values);
    });
  }, []);

  const handleEnd = useCallback(
    (key: string) => {
      setMovingItem(null);

      completedItems.add(key, transitionDuration);
    },
    [completedItems, transitionDuration]
  );

  /* 
    Сохранение порядка элементов для React, чтобы получить правильную анимацию. 
    Без сортировки элементы резко меняют позицию, несмотря на CSS `transition`.
    todo: Попробовать избавиться.
  */
  const sortedValues = useMemo(() => sortBy(prop("key"), values), [values]);

  return (
    <div style={{ ...getBoxStyle(box), position: "relative", ...style }}>
      {sortedValues.map((item) => {
        const { key, box } = item;

        const isActive = movingItem?.key === key;
        const isCompleted = completedItems.has(key);
        const zIndex = isActive ? 2 : isCompleted ? 1 : 0;

        const commonStyle = { zIndex };

        return (
          <DraggableBox
            key={key}
            value={isActive ? movingItem.box : box}
            onChange={(box) => handleChange({ key, box })}
            onEnd={() => handleEnd(key)}
            style={
              isActive
                ? commonStyle
                : {
                    ...commonStyle,
                    transitionDuration: `${transitionDuration}ms`,
                    transitionProperty: "top left",
                  }
            }
          >
            {renderItem(item)}
          </DraggableBox>
        );
      })}
    </div>
  );
};
