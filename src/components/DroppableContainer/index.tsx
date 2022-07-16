import { remove, update } from "ramda";
import { LegacyRef, useCallback, useState } from "react";
import { IDndElement, useDndConnection } from "../../decorators/dndConnection";
import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle, stretchStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";

interface IDroppableContainerProps {
  id: string;
  initialItems: IDndElement[];
}

export const DroppableContainer: React.VFC<IDroppableContainerProps> = ({
  id,
  initialItems,
}) => {
  const handleDragIn = useCallback((item: IDndElement) => {
    return { canDrop: true };
  }, []);

  const handleDropIn = useCallback((item: IDndElement) => {
    // Делаем анимацию через setTimeout, монтируем элемент
    setItems((items) => {
      return [item, ...items];
    });

    return { canDrop: true };
  }, []);

  const { ref, onDrag, onDrop } = useDndConnection(id, {
    onDragIn: handleDragIn,
    onDropIn: handleDropIn,
  });

  const [items, setItems] = useState<IDndElement[]>(initialItems);

  const handleDrag = useCallback(
    (item: IDndElement) => {
      onDrag(id, item);

      setItems((prevState) => {
        const index = prevState.findIndex(({ key }) => key === item.key);

        return update(index, item, prevState);
      });
    },
    [id, onDrag]
  );

  // todo: срабатывает спустя 1-2 секунды после размонтирования. Зачем?
  const handleDrop = useCallback(
    (item: IDndElement) => {
      // todo: приходит неактуальный item!

      setItems((prevState) => {
        const index = prevState.findIndex(({ key }) => key === item.key);

        if (!~index) {
          return prevState;
        }

        const { canDrop } = onDrop(id, prevState[index]);

        return canDrop ? remove(index, 1, prevState) : prevState;
      });
    },
    [id, onDrop]
  );

  return (
    <div
      style={{
        ...getBoxStyle(BoundingBox.createByDimensions(0, 0, 200, 600)),
        background: "grey",
        position: "relative",
      }}
      ref={ref as LegacyRef<HTMLDivElement>}
    >
      {items.map((item) => (
        <DraggableBox
          key={item.key}
          value={item.box}
          onChange={(box) => handleDrag({ ...item, box })}
          onEnd={() => handleDrop(item)}
          style={{ zIndex: 1 }}
        >
          <div
            style={{
              ...stretchStyle,
              background: "orange",
              cursor: "pointer",
            }}
          >
            {item.key}
          </div>
        </DraggableBox>
      ))}
    </div>
  );
};
