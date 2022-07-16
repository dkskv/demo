import { always, append, find, propEq, reject } from "ramda";
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

interface IResponse {
  canDrop: boolean;

  // isOutsideSource: boolean;
}

interface IInputEventHandler {
  (a: IDndElement): IResponse;
}

/** Подписка на входящие элементы. Callback'и возвращают разрешение на вход */
interface IInputConnection {
  onDragIn: IInputEventHandler;
  onDropIn: IInputEventHandler;
}

interface IOutputEventHandler {
  (key: string, a: IDndElement): IResponse;
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

const defaultResponse: IResponse = { canDrop: false };

export function useDndConnection(key: string, input: IInputConnection) {
  const { onDrag, onDrop, register, unregister } = useContext(DndContext);

  const ref = useRef<Element>();

  // todo: доделать
  useEffect(() => {
    if (ref.current) {
      register({ key, element: ref.current, ...input });

      return () => unregister(key);
    }
  }, []);

  return { ref, onDrag, onDrop } as const;
}

const DndContext = createContext<IDndContext>({
  register: noop,
  unregister: noop,
  onDrag: always(defaultResponse),
  onDrop: always(defaultResponse),
});

function isContainerOverlapWith(box: BoundingBox) {
  return ({ element }: IDndContainer) =>
    getBoxOnPage(element).intersectionArea(box) > 0;
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

      const targetContainer = containers.find(
        isContainerOverlapWith(itemBoxOnPage)
      );

      return sourceContainer === targetContainer
        ? { itemBoxOnPage }
        : { targetContainer, itemBoxOnPage };
    },
    [containers]
  );

  const onDrag = useCallback(
    (containerKey: string, item: IDndElement) => {
      const { itemBoxOnPage, targetContainer } = handleDndEvent(
        containerKey,
        item
      );

      if (!targetContainer) {
        return defaultResponse;
      }

      return targetContainer.onDragIn({
        ...item,
        box: getBoxOnPage(targetContainer.element).placeInside(itemBoxOnPage),
      });
    },
    [handleDndEvent]
  );

  const onDrop = useCallback(
    (containerKey: string, item: IDndElement) => {
      const { itemBoxOnPage, targetContainer } = handleDndEvent(
        containerKey,
        item
      );

      if (!targetContainer) {
        return defaultResponse;
      }

      return targetContainer.onDropIn({
        ...item,
        box: getBoxOnPage(targetContainer.element).placeInside(itemBoxOnPage),
      });
    },
    [handleDndEvent]
  );

  const value = useMemo<IDndContext>(
    () => ({ register, unregister, onDrag, onDrop }),
    [register, unregister, onDrag, onDrop]
  );

  return <DndContext.Provider value={value}>{children}</DndContext.Provider>;
};
