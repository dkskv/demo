import {
  append,
  both,
  complement,
  compose,
  find,
  identical,
  propEq,
  reject,
} from "ramda";
import { useCallback, useMemo, useState } from "react";
import { DndConnectionContext } from "./dndConnectionContext";
import { DndContainer } from "./entities/dndContainer";
import { IDndHandler, IPreparedDndEvent } from "./index.types";
import { useDndNotifier } from "./useDndNotifier";

interface IProps {
  children: React.ReactNode;
}

/** Выступает в роли сервера между контейнерами, которые хотят обменяться элементами */
export const DndConnector: React.FC<IProps> = ({ children }) => {
  const [containers, setContainers] = useState<DndContainer[]>([]);

  const register = useCallback((item: DndContainer) => {
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

      const itemBoxOnViewport = sourceContainer.box.placeOutside(item.box);

      const isNotSourceContainer = complement(identical(sourceContainer));
      const isContainerOverlapBox = (container: DndContainer) =>
        container.isOverlapWith(itemBoxOnViewport);

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
    <DndConnectionContext.Provider
      value={useMemo(
        () => ({ register, onDrag, onDrop }),
        [register, onDrag, onDrop]
      )}
    >
      {children}
    </DndConnectionContext.Provider>
  );
};
