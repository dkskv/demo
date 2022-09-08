import { useDragMovement } from "../../decorators/dnd";
import { useBooleanState } from "../../decorators/useBooleanState";
import { useScale } from "../../decorators/useScale";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { noop } from "../../utils/common";
import { WheelScalingK } from "../../utils/constants";
import { NumbersRange } from "../../utils/numbersRange";
import { Point } from "../../utils/point";
import { IImageBoxProps, ImageBox } from "../ImageBox";

interface IProps extends IImageBoxProps {
  viewBox: NonNullable<IImageBoxProps["viewBox"]>;
  onViewBoxChange(b: BoundingBox): void;
  scaleBounds?: NumbersRange;
}

export const ScalableImage: React.FC<IProps> = ({
  box,
  src,
  viewBox,
  onViewBoxChange,
  scaleBounds = new NumbersRange(0.2, 1),
}) => {
  const [element, setElement] = useCallbackRef();

  function handleScale(delta: number, p: Point) {
    const nextViewBox = viewBox
      .scale(delta * WheelScalingK)
      .constrainSize(scaleBounds, scaleBounds)
      .placeInSameOrigin(viewBox, p)
      .clampByOuter(BoundingBox.fromOrigin(1, 1));

    onViewBoxChange(nextViewBox);
  }

  useScale(element, { onChange: handleScale });

  const handleDrag = function (delta: Point) {
    const scaledDelta = delta.div(
      new Point(box.dx / viewBox.dx, box.dy / viewBox.dy)
    );

    const nextViewBox = viewBox
      .shift(scaledDelta.negate())
      .clampByOuter(BoundingBox.fromOrigin(1, 1));

    onViewBoxChange(nextViewBox);
  };

  const isScaled = viewBox.dx < 1 || viewBox.dy < 1;

  const [isDrag, enableDragFlag, disableDragFlag] = useBooleanState(false);
  useDragMovement({
    element,
    onChange: isScaled ? handleDrag : noop,
    onStart: isScaled ? enableDragFlag : noop,
    onEnd: isScaled ? disableDragFlag : noop,
  });

  return (
    <div
      ref={setElement}
      style={{ cursor: isScaled ? (isDrag ? "grabbing" : "grab") : "auto" }}
    >
      <ImageBox box={box} src={src} viewBox={viewBox} />
    </div>
  );
};
