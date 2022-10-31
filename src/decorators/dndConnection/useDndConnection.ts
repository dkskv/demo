import { useContext, useEffect, useRef } from "react";
import { getBoxOnViewport } from "../../utils/dom";
import { useCallbackRef } from "../useCallbackRef";
import { DndConnectionContext } from "./dndConnectionContext";
import { DndContainer } from "./entities/dndContainer";
import { IDndConnection } from "./index.types";

export function useDndConnection<T extends HTMLElement = HTMLElement>(
  containerKey: string,
  connection: Partial<IDndConnection>
) {
  const { onDrag, onDrop, register } = useContext(DndConnectionContext);
  const [element, setElement] = useCallbackRef<T>();
  const container = useRef<DndContainer | null>(null);

  useEffect(() => {
    if (element) {
      container.current = new DndContainer(
        containerKey,
        getBoxOnViewport(element)
      );
      return register(container.current);
    }
  }, [register, containerKey, element]);

  useEffect(() => {
    container.current?.updateConnection(connection);
  }, [connection]);

  return { ref: setElement, onDrag, onDrop } as const;
}
