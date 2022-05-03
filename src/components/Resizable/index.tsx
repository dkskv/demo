import React from "react";
import makeStateful from "../../decorators/makeStateful";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import {
  IResizeParams,
  useDragBox,
  useResize,
} from "./hooks";
import { resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";

interface IProps
  extends Pick<
    Partial<IResizeParams>,
    "sizeBounds" | "keepAspectRatio" | "thumbKeys" | "ThumbComponent" | "onStart" | "onEnd"
  > {
  value: BoundingBox;
  onChange: IResizeParams["onChange"];
}

const Resizable: React.FC<IProps> = ({
  value,
  onChange,
  onStart,
  onEnd,
  sizeBounds = {},
  keepAspectRatio = false,
  thumbKeys = resizingPointsPreset.all,
  ThumbComponent = Thumb,
  children,
}) => {
  const [element, setRef] = useCallbackRef();

  useDragBox({ element, onChange, onStart, onEnd });

  const thumbsElements = useResize({
    box: value,
    onChange,
    onStart,
    onEnd,
    sizeBounds,
    keepAspectRatio,
    thumbKeys,
    ThumbComponent,
  });

  return (
    <>
      <div ref={setRef} style={{ ...getBoxStyle(value), position: "absolute" }}>
        {/* todo: растягивать на 100% по умолчанию? */}
        {React.Children.only(children)}
      </div>
      {thumbsElements}
    </>
  );
};

export default makeStateful(Resizable);
