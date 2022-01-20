import React from "react";
import "./index.css";

interface IProps {
  x: number;
  y: number;
  name: string;
}

interface IProperties {
  className: string
}

interface IDndItem extends React.FC<IProps>, IProperties {}

const DndItem: IDndItem = ({ name, x, y, children }) => {
  return (
    <div
      data-name={name}
      className={DndItem.className}
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {children}
    </div>
  );
};

DndItem.className = "DndItem"

export default DndItem;
