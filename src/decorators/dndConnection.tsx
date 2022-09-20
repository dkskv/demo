import {
  always,
  append,
  both,
  complement,
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
  useRef,
} from "react";
import { BoundingBox } from "../utils/boundingBox";
import { noop } from "../utils/common";
import { getBoxOnPage } from "../utils/dom";

export interface IDndElement {
  key: string;
  box: BoundingBox;
}

interface IContainerResponse {
  canDrop: boolean;
}

/** Подписка на входящие элементы. Callback'и возвращают разрешение на вход */
interface IInputConnection {
  // todo: подумать над внедрением дополнительного callback'а вместо использования isFirstEvent.
  onDragIn(a: IDndElement, isFirstEvent: boolean): IContainerResponse;
  onDropIn(a: IDndElement): IContainerResponse;
  onDragOut(key: string): void;
}

interface IDropResponse extends IContainerResponse {
  isOutside: boolean;
}

interface IDragResponse extends IDropResponse {}

interface IDropHandler {
  (containerKey: string, a: IDndElement): IDropResponse;
}

interface IDragHandler {
  (containerKey: string, a: IDndElement): IDragResponse;
}

/** Оповещение об исходящих элементах. Callback'и возвращают разрешение на выход */
interface IOutputConnection {
  onDrag: IDragHandler;
  onDrop: IDropHandler;
}

interface IDndContainer extends IInputConnection {
  key: string;
  element: Element;
}

interface IDndContext extends IOutputConnection {
  register(a: IDndContainer): () => void;
}

const dragResponseFromVoid: IDragResponse = {
  canDrop: false,
  isOutside: true,
};

const dropResponseFromVoid: IDropResponse = {
  canDrop: false,
  isOutside: true,
};

const voidResponse: IContainerResponse = { canDrop: false };
const voidContainerHandler = always(voidResponse);

const DndContext = createContext<IDndContext>({
  register: always(noop),
  onDrag: always(dragResponseFromVoid),
  onDrop: always(dropResponseFromVoid),
});

export function useDndConnection<T extends Element = Element>(
  key: string,
  input: Partial<IInputConnection>
) {
  const { onDrag, onDrop, register } = useContext(DndContext);

  const ref = useRef<T>(null);

  // todo: доделать
  useEffect(() => {
    if (ref.current) {
      const {
        onDragIn = voidContainerHandler,
        onDropIn = voidContainerHandler,
        onDragOut = noop,
      } = input;

      return register({
        key,
        element: ref.current,
        onDragIn,
        onDropIn,
        onDragOut,
      });
    }
  }, []);

  return { ref, onDrag, onDrop } as const;
}

/** Компонент выступает в роли сервера между контейнерами, которые хотят обменяться элементами */
export const DndConnector: React.FC = ({ children }) => {
  const [containers, setContainers] = useState<IDndContainer[]>([]);

  const register = useCallback((item: IDndContainer) => {
    setContainers(append(item));
    const unregister = () => setContainers(reject(propEq("key", item.key)));
    return unregister;
  }, []);

  /** Возвращает независимо позиционированный бокс для перемещаемого элемента и целевой контейнер */
  const handleDndEvent = useCallback(
    (containerKey: string, item: IDndElement) => {
      const sourceContainer = find(propEq("key", containerKey), containers);

      if (!sourceContainer) {
        throw new Error(
          `Контейнер с ключом ${containerKey} не зарегистрирован. Убедитесь, что ref связан с элементом`
        );
      }

      const itemBoxOnPage = getBoxOnPage(sourceContainer.element).placeOutside(
        item.box
      );

      const isNotSourceContainer = complement(identical(sourceContainer));
      const isContainerOverlapBox = isContainerOverlapWith(itemBoxOnPage);

      const targetContainer = containers.find(
        both(isNotSourceContainer, isContainerOverlapBox)
      );

      return {
        targetContainer,
        itemOnPage: replaceBox(item, itemBoxOnPage),
        isOutside: !isContainerOverlapBox(sourceContainer),
      };
    },
    [containers]
  );

  const { notifyAboutDrag, notifyAboutDrop } = useDndNotifier();

  const onDrag = useCallback(
    (containerKey: string, item: IDndElement) => {
      const { itemOnPage, targetContainer, isOutside } = handleDndEvent(
        containerKey,
        item
      );

      return { ...notifyAboutDrag(itemOnPage, targetContainer), isOutside };
    },
    [handleDndEvent, notifyAboutDrag]
  );

  const onDrop = useCallback(
    (containerKey: string, item: IDndElement) => {
      const { itemOnPage, targetContainer, isOutside } = handleDndEvent(
        containerKey,
        item
      );

      return { ...notifyAboutDrop(itemOnPage, targetContainer), isOutside };
    },
    [handleDndEvent, notifyAboutDrop]
  );

  const value = useMemo<IDndContext>(
    () => ({ register, onDrag, onDrop }),
    [register, onDrag, onDrop]
  );

  return <DndContext.Provider value={value}>{children}</DndContext.Provider>;
};

/** В ответ на dnd-событие оповещает затронутые контейнеры */
function useDndNotifier() {
  const visitedRef = useRef(new Map<string, IDndContainer | undefined>());
  const visited = visitedRef.current;

  const notifyAboutDrag = useCallback(
    (item: IDndElement, container: IDndContainer | undefined) => {
      const previous = visited.get(item.key);
      visited.set(item.key, container);

      const isContainerChanged = previous !== container;

      if (isContainerChanged && previous) {
        previous.onDragOut(item.key);
      }

      if (!container) {
        return dragResponseFromVoid;
      }

      const relativeItemBox = getBoxOnPage(container.element).placeInside(
        item.box
      );

      return container.onDragIn(
        replaceBox(item, relativeItemBox),
        isContainerChanged
      );
    },
    [visited]
  );

  const notifyAboutDrop = useCallback(
    (item: IDndElement, container: IDndContainer | undefined) => {
      visited.delete(item.key);

      if (!container) {
        return dropResponseFromVoid;
      }

      const relativeItemBox = getBoxOnPage(container.element).placeInside(
        item.box
      );

      return container.onDropIn(replaceBox(item, relativeItemBox));
    },
    [visited]
  );

  return { notifyAboutDrag, notifyAboutDrop } as const;
}

function isContainerOverlapWith(box: BoundingBox) {
  return ({ element }: IDndContainer) =>
    getBoxOnPage(element).intersectionArea(box) > 0;
}

function replaceBox(item: IDndElement, box: BoundingBox) {
  return { ...item, box };
}
