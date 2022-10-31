import { DndContainer } from "./entities/dndContainer";
import { DndElement } from "./entities/dndElement";

export interface IDndConnection {
  onDragIn(a: DndElement): void;
  onDragOn(a: DndElement): void;
  onDropIn(a: DndElement): void;
  onDragOut(key: string): void;
  canDrop(a: DndElement): boolean;
}

export interface IDndResponse {
  canDrop: boolean;
}

export interface IDndHandler {
  (containerKey: string, a: DndElement): IDndResponse;
}

export interface IPreparedDndEvent {
  itemOnViewport: DndElement;
  targetContainer: DndContainer | null;
}
