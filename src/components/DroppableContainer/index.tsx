import { LegacyRef, useCallback, useState } from "react";
import { IDndElement, useDndConnection } from "../../decorators/dndConnection";
import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle, stretchStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";

interface IDroppableContainerProps {
  id: string;
  initialItems: Record<string, BoundingBox>;
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
    setItems((state) => ({ ...state, [item.key]: item.box }));

    return { canDrop: true };
  }, []);

  const { ref, onDrag, onDrop } = useDndConnection(id, {
    onDragIn: handleDragIn,
    onDropIn: handleDropIn,
  });

  const [items, setItems] = useState(initialItems);

  const handleDrag = useCallback(
    (item: IDndElement) => {
      onDrag(id, item);

      setItems((state) => ({ ...state, [item.key]: item.box }));
    },
    [id, onDrag]
  );

  const handleDrop = useCallback(
    (key: keyof typeof items) => {
      setItems((state) => {
        if (!state[key]) {
          console.error(
            "дублирующийся вызов после размонтирования DraggableBox"
          );
          return state;
        }

        const { canDrop } = onDrop(id, { key, box: state[key] });

        if (canDrop) {
          const { [key]: _, ...rest } = state;
          return rest;
        }

        return state;
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
      {Object.entries(items).map(([key, box]) => (
        <DraggableBox
          key={key}
          value={box}
          onChange={(box) => handleDrag({ key, box })}
          onEnd={() => handleDrop(key)}
          style={{ zIndex: 1 }}
        >
          <div
            style={{
              ...stretchStyle,
              background: "orange",
              cursor: "pointer",
            }}
          >
            {key}
          </div>
        </DraggableBox>
      ))}
    </div>
  );
};
