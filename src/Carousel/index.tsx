import { useCallback, useMemo, useState } from "react";
import "./index.css";

interface IProps {
  itemWidth?: number;
  visibleCount?: number;
  gutter?: number;
  defaultKey?: string;
  // заменить на renderer
  items: { key: string; content: React.ReactNode }[];
}

const Arrow: React.FC<{ disabled: boolean; onClick(): void }> = ({
  children,
  disabled,
  onClick,
}) => {
  return (
    <div
      className={`Arrow ${disabled ? "Arrow_disabled" : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Carousel: React.VFC<IProps> = ({
  itemWidth = 100,
  gutter = 0,
  visibleCount = 3,
  defaultKey,
  items,
}) => {
  const stepWidth = itemWidth + gutter;
  const actualVisibleCount = Math.min(visibleCount, items.length);
  const maxPosition = -stepWidth * (items.length - actualVisibleCount);

  const defaultPosition = useMemo(() => {
    const index = items.findIndex(({ key }) => defaultKey === key);
    return ~index ? Math.max(-index * stepWidth, maxPosition) : 0;
  }, []);

  const [position, setPosition] = useState(defaultPosition);

  const handleClickPrev = useCallback(() => {
    setPosition(Math.min(position + stepWidth * visibleCount, 0));
  }, [position, stepWidth, visibleCount]);

  const handleClickNext = useCallback(() => {
    setPosition(Math.max(position - stepWidth * visibleCount, maxPosition));
  }, [position, stepWidth, visibleCount, maxPosition]);

  // Имеет смысл считать только если имеем фиксированный размер карточки
  const viewAreaWidth = actualVisibleCount * stepWidth - gutter;

  return (
    <div className="Carousel">
      <Arrow disabled={position === 0} onClick={handleClickPrev}>
        {"<"}
      </Arrow>
      <div className="ViewArea" style={{ width: viewAreaWidth }}>
        <div className="Strip" style={{ marginLeft: position }}>
          {items.map(({ key, content }) => (
            <div
              key={key}
              className="Item"
              style={{ width: itemWidth, marginRight: gutter }}
            >
              {content}
            </div>
          ))}
        </div>
      </div>
      <Arrow disabled={position === maxPosition} onClick={handleClickNext}>
        {">"}
      </Arrow>
    </div>
  );
};

export default Carousel;
