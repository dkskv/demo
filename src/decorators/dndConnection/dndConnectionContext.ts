import { always } from "ramda";
import { createContext } from "react";
import { noop } from "../../utils/common";
import { DndContainer } from "./entities/dndContainer";
import { IDndHandler } from "./index.types";

interface IDndConnectionContext {
  onDrag: IDndHandler;
  onDrop: IDndHandler;
  register(a: DndContainer): () => void;
}

export const DndConnectionContext = createContext<IDndConnectionContext>({
  register: always(noop),
  onDrag: always({ canDrop: false }),
  onDrop: always({ canDrop: false }),
});
