import React from "react";
import "./index.css";

interface Props {
    setElement(e: HTMLDivElement): void;
    children: React.ReactNode;
}

const Track: React.FC<Props> = ({ children, setElement }) => {
  return <div ref={setElement} className="Track">{children}</div>;
};

export default Track;
