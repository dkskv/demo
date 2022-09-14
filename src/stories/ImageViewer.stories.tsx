import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import { ImageBox } from "../components/ImageBox";
import ResizableControl from "../components/ResizableControl";
import { ScalableImage } from "../components/ScalableImage";
import { Space } from "../components/Space";
import { useTheme } from "../decorators/theme";
import { BoundingBox } from "../utils/boundingBox";
import { NumbersRange } from "../utils/numbersRange";
import { SizeBounds } from "../utils/sizeBounds";
import { stretchStyle, getBoxStyle } from "../utils/styles";

export default { title: "Demo" };

export const ImageViewer: ComponentStory<any> = () => {
  const [controlValue, setControlValue] = useState<BoundingBox>(() =>
    BoundingBox.createByDimensions(0, 0, 0.25, 0.25)
  );

  const imageBox = BoundingBox.createByDimensions(0, 0, 400, 400);
  const controlBox = BoundingBox.createByDimensions(0, 0, 300, 300);

  const scaleBounds = new NumbersRange(0.2, 1);

  const theme = useTheme();

  const src =
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg";

  return (
    <Space size={20}>
      <ScalableImage
        viewBox={controlValue}
        onViewBoxChange={setControlValue}
        src={src}
        box={imageBox}
        scaleBounds={scaleBounds}
      />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: theme.largeBorderRadius,
          ...getBoxStyle(controlBox),
        }}
      >
        <ImageBox box={controlBox} src={src} />
        <ResizableControl
          value={controlValue}
          onChange={setControlValue}
          outerBox={controlBox.resetOrigin()}
          keepAspectRatio={true}
          sizeBounds={new SizeBounds(scaleBounds, scaleBounds)}
        >
          <div
            style={{
              ...stretchStyle,
              border: `1px solid ${theme.strokeColor}`,
              boxShadow: `0 0 0 100vmax ${theme.overlayColor}`,
            }}
          />
        </ResizableControl>
      </div>
    </Space>
  );
};
