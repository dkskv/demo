import { ComponentStory } from "@storybook/react";
import { useState } from "react";
import { ImageBox } from "../components/ImageBox";
import ResizableControl from "../components/ResizableControl";
import { Space } from "../components/Space";
import { BoundingBox } from "../utils/boundingBox";
import { stretchStyle, getRgbaColor, getBoxStyle } from "../utils/styles";

export default { title: "Demo" };

export const ImageViewer: ComponentStory<any> = () => {
  const [controlValue, setControlValue] = useState<BoundingBox>(() =>
    BoundingBox.createByDimensions(0, 0, 0.25, 0.25)
  );

  const imageBox = BoundingBox.createByDimensions(0, 0, 400, 400);
  const controlBox = BoundingBox.createByDimensions(0, 0, 300, 300);

  const src =
    "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg";

  return (
    <Space size={20}>
      <ImageBox box={imageBox} src={src} />
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
