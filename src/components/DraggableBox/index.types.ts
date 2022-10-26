import { BoundingBox } from "../../entities/boundingBox";
import { IDragEvent } from "../../utils/drag";

interface IDragBoxEvent extends IDragEvent {
  box: BoundingBox;
}

export interface IDragBoxCallback {
  (e: IDragBoxEvent): void;
}

export interface IDragBoxCallbacks {
  onChange: IDragBoxCallback;
  onStart?: IDragBoxCallback;
  onEnd?: IDragBoxCallback;
}

export interface IDragBoxSettings {
  /** Внешний бокс, в чьих пределах может перемещаться данный */
  outerBox?: BoundingBox;
}
