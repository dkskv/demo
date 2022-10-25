import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/common";
import { SizeLimits } from "../../utils/sizeLimits";

export interface IResizeEvent {
  box: BoundingBox;
  pressedKeys: IPressedKeys;
}

export interface IResizeCallback {
  (e: IResizeEvent): void;
}

export interface IResizeCallbacks {
  onChange: IResizeCallback;
  onStart?: IResizeCallback;
  onEnd?: IResizeCallback;
}

export interface IResizeConstrains {
  sizeLimits: SizeLimits;
  outerBox: BoundingBox;
  keepAspectRatio: boolean;
}
