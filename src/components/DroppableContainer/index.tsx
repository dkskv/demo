import { LegacyRef, useCallback, useState } from "react";
import { IDndElement, useDndConnection } from "../../decorators/dndConnection";
import { useTemporarySet } from "../../decorators/useTemporarySet";
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
  const dur = 300;
  const { add, has } = useTemporarySet<string>();

  const handleDragIn = useCallback((item: IDndElement) => {
    return { canDrop: true };
  }, []);

  const placeSmoothly = useCallback(
    (key: keyof typeof items) => {
      add(key, dur);

      setTimeout(() => {
        setItems((state) => ({ ...state, [key]: state[key].resetOrigin() }));
      });
    },
    [add]
  );

  const handleDropIn = useCallback(
    (item: IDndElement) => {
      setItems((state) => ({ ...state, [item.key]: item.box }));

      placeSmoothly(item.key);

      return { canDrop: true };
    },
    [placeSmoothly]
  );

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
        const { canDrop } = onDrop(id, { key, box: state[key] });

        if (canDrop) {
          const { [key]: _, ...rest } = state;
          return rest;
        }

        placeSmoothly(key);

        return state;
      });
    },
    [id, onDrop, placeSmoothly]
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
          style={{
            zIndex: 1,
            userSelect: "none",
            transitionDuration: has(key) ? `${dur}ms` : undefined,
            transitionProperty: "top left",
          }}
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
