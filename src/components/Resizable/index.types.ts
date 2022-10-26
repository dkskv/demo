import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/dom";
import { SizeLimits } from "../../utils/sizeLimits";
import { IResizeHandleKey } from "./utils/resizingHandlesPreset";

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

export interface IResizeConstraints {
  sizeLimits: SizeLimits;
  outerBox: BoundingBox;
  keepAspectRatio: boolean;
}

export interface IResizableSettings extends IResizeConstraints {
  /** Ключи отображаемых кнопок, за которые производится resize  */
  handlesKeys?: readonly IResizeHandleKey[];
}
