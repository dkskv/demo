import { update } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { IObservable } from "../../utils/emitter";
import { getBoxStyle, stretchStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";

// todo: Возможно, вынести, также использовать в Sortable
export interface IMovable {
  key: string;
  box: BoundingBox;
}

interface IDroppableContainerProps {
  id: string;

  onMove(id: string, item: IMovable): void;
  onDrop(id: string, item: IMovable): boolean; // потерян ли

  // Подписка на события внешнего элемента

  // overlapObservable: IObservable<IMovable>;
  dropObservable: IObservable<IMovable>;
}

// - Анимацией занимается целевой контейнер
// - Обработкой перетаскивания и рендером перетаскиваемого занимается исходный контейнер
export const DroppableContainer: React.VFC<IDroppableContainerProps> = ({
  id,
  onDrop,
  onMove,
  dropObservable,
}) => {
  // todo: возможно, создать хук, н-р, useDrop

  const handleOverlap = useCallback((item: IMovable) => {
    // В начальной реализации ничего не делаем
  }, []);

  const handleDrop = useCallback((item: IMovable) => {
    // Делаем анимацию через setTimeout, монтируем элемент
  }, []);

  useEffect(() => {
    dropObservable.subscribe(handleDrop);
  }, [dropObservable, handleDrop]);

  const [items, setItems] = useState<IMovable[]>([
    { key: "0", box: BoundingBox.createByDimensions(0, 0, 200, 200) },
  ]);

  const handleMove = useCallback(
    (item: IMovable) => {
      setItems((prevState) => {
        const index = prevState.findIndex(({ key }) => key === item.key);

        return update(index, item, prevState);
      });

      onMove(id, item);
    },
    [id, onMove]
  );

  return (
    <div
      style={{
        ...getBoxStyle(BoundingBox.createByDimensions(0, 0, 200, 600)),
        background: "grey",
      }}
    >
      {items.map((item) => (
        <DraggableBox
          key={item.key}
          value={item.box}
          onChange={(box) => handleMove({ ...item, box })}
        >
          <div
            style={{ ...stretchStyle, background: "orange", cursor: "pointer" }}
          >
            {item.key}
          </div>
        </DraggableBox>
      ))}
    </div>
  );
};
