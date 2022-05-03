import { IOrientation } from "../../utils/orientation";

export interface IPattern {
  /** Шаг между линиями, в % */
  step: number;
  /** Толщина каждой линии, в px */
  thickness: number;
}

export function createDef(
  patternKey: string,
  orientation: IOrientation,
  { step, thickness }: IPattern,
  color: string
) {
  const patternProps = {
    [orientation.cssKeys.length]: `${step}px`,
    [orientation.cssKeys.thickness]: "1",
  };

  const rectProps = {
    [orientation.cssKeys.length]: `${thickness}px`,
    [orientation.cssKeys.thickness]: "1",
  };

  return (
    <pattern
      {...patternProps}
      id={patternKey}
      key={patternKey}
      patternUnits="userSpaceOnUse"
    >
      <rect {...rectProps} fill={color} />
    </pattern>
  );
}

export function getMarking(patternKey: string) {
  return (
    <line
      x1={`${0}%`}
      x2={`${100}%`}
      y1={`${50}%`}
      y2={`${50}%`}
      key={patternKey}
      stroke={`url(#${patternKey})`}
      strokeWidth="100%"
    />
  );
}
