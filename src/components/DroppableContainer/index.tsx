import { useCallback, useEffect, useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";

// todo: Возможно, вынести, также использовать в Sortable
interface IMovable {
  key: string;
  box: BoundingBox;
}

interface IObservable<T> {
  subscribe(f: (value: T) => void): void;
}

interface IDroppableContainerProps {
  onMove(item: IMovable): void;
  onDrop(item: IMovable): boolean; // потерян ли

  // Подписка на события внешнего элемента

  overlapObservable: IObservable<IMovable>;
  dropObservable: IObservable<IMovable>;
}

// - Анимацией занимается целевой контейнер
// - Обработкой перетаскивания и рендером перетаскиваемого занимается исходный контейнер
export const DroppableContainer: React.VFC<IDroppableContainerProps> = ({
  onDrop,
  onMove,
  overlapObservable,
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

  useEffect(() => {
    overlapObservable.subscribe(handleOverlap);
  }, [overlapObservable, handleOverlap]);

  const [items, setItems] = useState<IMovable[]>([
    { key: "0", box: BoundingBox.createByDimensions(0, 0, 200, 200) },
  ]);

  const handleMove = useCallback(
    (item: IMovable) => {
      setItems((prevState) => {
        const index = prevState.findIndex(({ key }) => key === item.key);

        prevState[index] = item;

        return prevState;
      });

      onMove(item);
    },
    [onMove]
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
          value={item.box}
          onChange={(box) => handleMove({ ...item, box })}
        >
          {item.key}
        </DraggableBox>
      ))}
    </div>
  );
};
