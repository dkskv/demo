import "./index.css";
import "../index.css";
import Draggable from "../Draggable";
import Resizable from "../Resizable";
import { Point } from "../utils/point";
import { BoundingBox } from "../utils/boundingBox";
import { SizesConstraints } from "../utils/sizesConstraints";

const DndTest = () => {
  return (
    <div className="DndTest">
      <Draggable initialValue={new Point(300, 300)}>
        <div className="Thumb" />
      </Draggable>
      <Resizable
        initialValue={BoundingBox.createByDimensions(50, 60, 200, 150)}
        sizesConstraints={SizesConstraints.onlyMax(400, 400)}
      >
        <div className="Resizable" />
      </Resizable>
    </div>
  );
};

export default DndTest;
