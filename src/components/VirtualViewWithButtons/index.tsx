import { useState } from "react";
import Button from "../Button";
import { VirtualView } from "../VirtualView";
import { useControlButtonsHandlers } from "./hooks";
import "./index.css";

interface IProps {}

export const VirtualViewWithButtons: React.VFC<IProps> = (props) => {
  const itemSize = 120;
  const gutter = 10;

  const slotSize = itemSize + gutter;

  const [position, setPosition] = useState(220);

  const viewAreaSize = 440;

  const buttonsHandlers = useControlButtonsHandlers(slotSize, setPosition);

  return (
    <div className="container">
      <Button onClick={buttonsHandlers.back}>{"<"}</Button>
      <VirtualView
        viewAreaSize={viewAreaSize}
        itemSize={itemSize}
        gutter={gutter}
        position={position}
        count={15}
        renderItem={(i) => {
          return `${i + 1}-й`;
        }}
      />
      <Button onClick={buttonsHandlers.forward}>{">"}</Button>
    </div>
  );
};
