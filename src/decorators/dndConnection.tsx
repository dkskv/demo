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

interface IConnectorResponse extends IContainerResponse {
  isOutside: boolean;
}

interface IInputEventHandler {
  (a: IDndElement): IContainerResponse;
}

/** Подписка на входящие элементы. Callback'и возвращают разрешение на вход */
interface IInputConnection {
  onDragIn: IInputEventHandler;
  onDropIn: IInputEventHandler;
  onDragOut(key: string): void;
}

interface IOutputEventHandler {
  (key: string, a: IDndElement): IConnectorResponse;
}

/** Оповещение об исходящих элементах. Callback'и возвращают разрешение на выход */
interface IOutputConnection {
  onDrag: IOutputEventHandler;
  onDrop: IOutputEventHandler;
}

interface IDndContainer extends IInputConnection {
  key: string;
  element: Element; // мб все-таки ref?
}

interface IDndContext extends IOutputConnection {
  register(a: IDndContainer): void;
  unregister(key: string): void;
}

const responseFromVoid: IConnectorResponse = {
  canDrop: false,
  isOutside: true,
};

const DndContext = createContext<IDndContext>({
  register: noop,
  unregister: noop,
  onDrag: always(responseFromVoid),
  onDrop: always(responseFromVoid),
});

export function useDndConnection<T extends Element = Element>(
  key: string,
  input: IInputConnection
) {
  const { onDrag, onDrop, register, unregister } = useContext(DndContext);

  const ref = useRef<T>(null);

  // todo: доделать
  useEffect(() => {
    if (ref.current) {
      register({ key, element: ref.current, ...input });

      return () => unregister(key);
    }
  }, []);

  return { ref, onDrag, onDrop } as const;
}

/** Компонент выступает в роли сервера между контейнерами, которые хотят обменяться элементами */
export const DndConnector: React.FC = ({ children }) => {
  const [containers, setContainers] = useState<IDndContainer[]>([]);

  const register = useCallback(
    (item: IDndContainer) => setContainers(append(item)),
    []
  );

  const unregister = useCallback(
    (key: string) => setContainers(reject(propEq("key", key))),
    []
  );

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
      const isContainerOverlapWithItem = isContainerOverlapWith(itemBoxOnPage);

      const targetContainer = containers.find(
        both(isNotSourceContainer, isContainerOverlapWithItem)
      );

      return {
        targetContainer,
        itemBoxOnPage,
        isOutside: !isContainerOverlapWithItem(sourceContainer),
      };
    },
    [containers]
  );

  const [handleVisit, forgetDndElement] = useDragOutNotifier();

  const onDrag = useCallback(
    (containerKey: string, item: IDndElement) => {
      const { itemBoxOnPage, targetContainer, isOutside } = handleDndEvent(
        containerKey,
        item
      );

      handleVisit(item.key, targetContainer);

      const response = targetContainer
        ? targetContainer.onDragIn({
            ...item,
            box: getBoxOnPage(targetContainer.element).placeInside(
              itemBoxOnPage
            ),
          })
        : responseFromVoid;

      return { ...response, isOutside };
    },
    [handleDndEvent, handleVisit]
  );

  const onDrop = useCallback(
    (containerKey: string, item: IDndElement) => {
      const { itemBoxOnPage, targetContainer, isOutside } = handleDndEvent(
        containerKey,
        item
      );

      forgetDndElement(item.key);

      const response = targetContainer
        ? targetContainer.onDragIn({
            ...item,
            box: getBoxOnPage(targetContainer.element).placeInside(
              itemBoxOnPage
            ),
          })
        : responseFromVoid;

      return { ...response, isOutside };
    },
    [handleDndEvent, forgetDndElement]
  );

  const value = useMemo<IDndContext>(
    () => ({ register, unregister, onDrag, onDrop }),
    [register, unregister, onDrag, onDrop]
  );

  return <DndContext.Provider value={value}>{children}</DndContext.Provider>;
};

function isContainerOverlapWith(box: BoundingBox) {
  return ({ element }: IDndContainer) =>
    getBoxOnPage(element).intersectionArea(box) > 0;
}

function useDragOutNotifier() {
  const visitedRef = useRef(new Map<string, IDndContainer | undefined>());
  const visited = visitedRef.current;

  const handleVisit = useCallback(
    (itemKey: string, container: IDndContainer | undefined) => {
      const previous = visited.get(itemKey);
      visited.set(itemKey, container);

      if (!previous || previous === container) {
        return;
      }

      previous.onDragOut(itemKey);
    },
    [visited]
  );

  const forgetDndElement = useCallback(
    (itemKey: string) => visited.delete(itemKey),
    [visited]
  );

  return [handleVisit, forgetDndElement] as const;
}
