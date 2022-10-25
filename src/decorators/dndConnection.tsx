import {
  always,
  append,
  both,
  complement,
  compose,
  find,
  identical,
  propEq,
  reject,
} from "ramda";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BoundingBox } from "../utils/boundingBox";
import { noop } from "../utils/common";
import { getBoxOnPage } from "../utils/dom";
import { useCallbackRef } from "./useCallbackRef";

/** Подписка на входящие элементы. Callback'и возвращают разрешение на вход */
interface IInputConnection {
  onDragIn(a: DndElement): void;
  onDragOn(a: DndElement): void;
  onDropIn(a: DndElement): void;
  onDragOut(key: string): void;
  canDrop(a: DndElement): boolean;
}

interface IDndResponse {
  canDrop: boolean;
}

interface IDndHandler {
  (containerKey: string, a: DndElement): IDndResponse;
}

interface IDndContainer extends IInputConnection {
  key: string;
  element: Element;
}

function isContainerOverlapWith(box: BoundingBox) {
  return ({ element }: IDndContainer) =>
    getBoxOnPage(element).intersectionArea(box) > 0;
}

export class DndElement {
  constructor(public key: string, public box: BoundingBox) {}

  placeRelative({ element }: IDndContainer) {
    return this.replaceBox(getBoxOnPage(element).placeInside(this.box));
  }

  replaceBox(box: BoundingBox) {
    return new DndElement(this.key, box);
  }
}

interface IPreparedDndEvent {
  itemOnViewport: DndElement;
  targetContainer: IDndContainer | null;
}

interface IDndContext {
  onDrag: IDndHandler;
  onDrop: IDndHandler;
  register(a: IDndContainer): () => void;
}

const DndContext = createContext<IDndContext>({
  register: always(noop),
  onDrag: always({ canDrop: false }),
  onDrop: always({ canDrop: false }),
});

export function useDndConnection<T extends HTMLElement = HTMLElement>(
  key: string,
  input: Partial<IInputConnection>
) {
  const { onDrag, onDrop, register } = useContext(DndContext);

  const [element, setElement] = useCallbackRef<T>();

  // todo: реализовать обновление входных данных для контейнера
  useEffect(() => {
    if (element) {
      const {
        onDragIn = noop,
        onDragOn = noop,
        onDropIn = noop,
        onDragOut = noop,
        canDrop = always(false),
      } = input;

      return register({
        key,
        element,
        onDragIn,
        onDragOn,
        onDropIn,
        onDragOut,
        canDrop,
      });
    }
  }, [element]);

  return { ref: setElement, onDrag, onDrop } as const;
}

/** Выступает в роли сервера между контейнерами, которые хотят обменяться элементами */
export const DndConnector: React.FC = ({ children }) => {
  const [containers, setContainers] = useState<IDndContainer[]>([]);

  const register = useCallback((item: IDndContainer) => {
    setContainers(append(item));

    return function unregister() {
      setContainers(reject(propEq("key", item.key)));
    };
  }, []);

  const prepareDndEvent = useCallback<
    (...p: Parameters<IDndHandler>) => IPreparedDndEvent
  >(
    (containerKey, item) => {
      const sourceContainer = find(propEq("key", containerKey), containers);

      if (!sourceContainer) {
        throw new Error(
          `Контейнер с ключом ${containerKey} не зарегистрирован. Убедитесь, что ref связан с элементом`
        );
      }

      const itemBoxOnViewport = getBoxOnPage(
        sourceContainer.element
      ).placeOutside(item.box);

      const isNotSourceContainer = complement(identical(sourceContainer));
      const isContainerOverlapBox = isContainerOverlapWith(itemBoxOnViewport);

      return {
        targetContainer:
          containers.find(both(isNotSourceContainer, isContainerOverlapBox)) ??
          null,
        itemOnViewport: item.replaceBox(itemBoxOnViewport),
      };
    },
    [containers]
  );

  const { notifyAboutDrag, notifyAboutDrop } = useDndNotifier();

  const onDrag = useCallback(compose(notifyAboutDrag, prepareDndEvent), [
    notifyAboutDrag,
    prepareDndEvent,
  ]);

  const onDrop = useCallback(compose(notifyAboutDrop, prepareDndEvent), [
    notifyAboutDrop,
    prepareDndEvent,
  ]);

  return (
    <DndContext.Provider
      value={useMemo(
        () => ({ register, onDrag, onDrop }),
        [register, onDrag, onDrop]
      )}
    >
      {children}
    </DndContext.Provider>
  );
};

/** В ответ на dnd-событие оповещает затронутые контейнеры */
function useDndNotifier() {
  const availableContainers = useState(
    () => new Map<string, IDndContainer | null>()
  )[0];
  const visitedContainers = useState(
    () => new Map<string, IDndContainer | null>()
  )[0];

  const notifyAboutDrag = useCallback(
    ({
      itemOnViewport: item,
      targetContainer: container,
    }: IPreparedDndEvent): IDndResponse => {
      const previousContainer = visitedContainers.get(item.key);
      visitedContainers.set(item.key, container);

      // todo: сравнивать по ключам, а не по ссылкам
      const isDragOut = previousContainer && previousContainer !== container;

      if (
        isDragOut &&
        previousContainer === availableContainers.get(item.key)
      ) {
        availableContainers.delete(item.key);
        previousContainer.onDragOut(item.key);
      }

      if (!container) {
        return { canDrop: false };
      }

      const isDragIn = previousContainer !== container;
      const relativeItem = item.placeRelative(container);

      if (isDragIn && container.canDrop(relativeItem)) {
        availableContainers.set(item.key, container);
        container.onDragIn(relativeItem);
        return { canDrop: true };
      }

      if (availableContainers.has(item.key)) {
        container.onDragOn(relativeItem);
        return { canDrop: true };
      }

      return { canDrop: false };
    },
    [availableContainers, visitedContainers]
  );

  const notifyAboutDrop = useCallback(
    ({
      itemOnViewport: item,
      targetContainer: container,
    }: IPreparedDndEvent): IDndResponse => {
      visitedContainers.delete(item.key);
      const canDrop = availableContainers.delete(item.key);

      if (!canDrop || !container) {
        return { canDrop: false };
      }

      container.onDropIn(item.placeRelative(container));

      return { canDrop: true };
    },
    [availableContainers, visitedContainers]
  );

  return { notifyAboutDrag, notifyAboutDrop } as const;
}
