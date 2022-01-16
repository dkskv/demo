import React from "react";
import "./index.css";

interface Props {
    children: React.ReactNode;
}

const Track = React.forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  return <div ref={ref} className="Track">{children}</div>;
});

export default Track;
