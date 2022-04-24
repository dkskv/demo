import React, { useMemo } from "react";
import makeStateful from "../../decorators/makeStateful";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { BoxSizesBounds } from "../../utils/boxSizesBounds";
import { IResizeCallbackOptions, IResizeParams, useResize } from "./hooks";
import { resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";

interface IProps
  extends Pick<
    Partial<IResizeParams>,
    "sizesBounds" | "keepAspectRatio" | "thumbKeys" | "ThumbComponent"
  > {
  value: BoundingBox;
  onChange(value: BoundingBox, options: IResizeCallbackOptions): void;
}

const Resizable: React.FC<IProps> = ({
  value,
  onChange,
  sizesBounds = BoxSizesBounds.without(),
  keepAspectRatio = false,
  thumbKeys = resizingPointsPreset.all,
  ThumbComponent = Thumb,
  children,
}) => {
  const [element, setRef] = useCallbackRef();

  const thumbsElements = useResize({
    box: value,
    draggableElement: element,
    onChange,
    sizesBounds,
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
