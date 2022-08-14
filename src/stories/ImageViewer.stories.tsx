import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import { ImageBox } from "../components/ImageBox";
import ResizableControl from "../components/ResizableControl";
import { Space } from "../components/Space";
import { useDragMovement } from "../decorators/dnd";
import { useBooleanState } from "../decorators/useBooleanState";
import { useScale } from "../decorators/useScale";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { WheelScalingK } from "../utils/constants";
import { NumbersRange } from "../utils/numbersRange";
import { Point } from "../utils/point";
import { stretchStyle, getRgbaColor, getBoxStyle } from "../utils/styles";

export default { title: "Demo" };

export const ImageViewer: ComponentStory<any> = () => {
  const [controlValue, setControlValue] = useState<BoundingBox>(() =>
    BoundingBox.createByDimensions(0, 0, 0.25, 0.25)
  );

  const imageBox = BoundingBox.createByDimensions(0, 0, 400, 400);
  const controlBox = BoundingBox.createByDimensions(0, 0, 300, 300);

  const [element, setElement] = useCallbackRef();

  const lengthBounds = new NumbersRange(0.2, 1);

  function handleScale(delta: number, p: Point) {
    setControlValue((prevValue) => {
      return prevValue
        .scale(delta * WheelScalingK)
        .constrainSize(lengthBounds, lengthBounds)
        .moveTo(prevValue.denormalizePoint(p), p)
        .clampByOuter(BoundingBox.fromOrigin(1, 1));
    });
  }

  useScale(element, handleScale);

  const handleDrag = function (delta: Point) {
    setControlValue((prevValue) => {
      // todo: делать округление, иначе можно сместить изображение при исходном масштабе
      const scaledDelta = delta.div(
        new Point(imageBox.dx / controlValue.dx, imageBox.dy / controlValue.dy)
      );

      return prevValue
        .shift(scaledDelta.negate())
        .clampByOuter(BoundingBox.fromOrigin(1, 1));
    });
  };

  const [isDrag, onStart, onEnd] = useBooleanState(false);
  useDragMovement({ element, onChange: handleDrag, onStart, onEnd });

  const isScaled = controlValue.dx < 1 || controlValue.dy < 1;

  const src =
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg";

  return (
    <Space size={20}>
      <div
        ref={setElement}
        style={{ cursor: isScaled ? (isDrag ? "grabbing" : "grab") : "auto" }}
      >
        <ImageBox box={imageBox} src={src} viewBox={controlValue} />
      </div>
      <div
        style={{
          position: "relative",
          border: "1px solid black",
          ...getBoxStyle(controlBox),
        }}
      >
        <ImageBox box={controlBox} src={src} />
        <ResizableControl
          value={controlValue}
          onChange={setControlValue}
          outerBox={controlBox.resetOrigin()}
          keepAspectRatio={true}
          sizeBounds={{ width: lengthBounds, height: lengthBounds }}
        >
          <div
            style={{
              ...stretchStyle,
              background: getRgbaColor("#FFFFFF", 0.3),
              border: "1px solid orange",
            }}
          />
        </ResizableControl>
      </div>
    </Space>
  );
};
