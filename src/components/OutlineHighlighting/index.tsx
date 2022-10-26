import React from "react";
import { useTheme } from "../../decorators/theme";
import { BoundingBox } from "../../entities/boundingBox";
import { getBoxStyle } from "../../utils/styles";

interface IProps {
  size: number;
  box: BoundingBox;
  stage: number;
}

export const OutlineHighlighting: React.FC<IProps> = ({ size, box, stage }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        ...getBoxStyle(box.expandEvenly(stage * size)),
        position: "absolute",
        border: `5px solid ${theme.strokeColor}`,
        borderRadius: theme.largeBorderRadius,
        boxSizing: "border-box",
        opacity: 1 - stage,
        visibility: stage === 0 ? "hidden" : "visible",
      }}
    />
  );
};
