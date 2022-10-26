import { ReactNode } from "react";
import { Size } from "../entities/size";
import { useCallbackRef } from "./useCallbackRef";
import { useElementSize } from "./useElementSize";

interface IProps {
  children(size: Size): ReactNode;
  disableHeight?: boolean;
  disableWidth?: boolean;
}

export const AutoSizer: React.FC<IProps> = ({
  children,
  disableHeight = false,
  disableWidth = false,
}) => {
  const [element, setElement] = useCallbackRef();
  const size = useElementSize(element);

  return (
    <div
      style={{
        height: disableHeight ? undefined : "100%",
        width: disableWidth ? undefined : "100%",
        minWidth: 0,
        minHeight: 0,
      }}
      ref={setElement}
    >
      {children(size)}
    </div>
  );
};
