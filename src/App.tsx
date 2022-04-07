import { VirtualViewWithButtons } from "./components/VirtualViewWithButtons";
import NumberRangeInputWithSlider from "./components/NumberRangeInputWithSlider";
import { BoundingBox } from "./utils/boundingBox";
import { Range } from "./utils/range";
import Resizable from "./components/Resizable";
import { BoxSizesBounds } from "./utils/boxSizesBounds";

function App() {
  return (
    <div className="App">
      <NumberRangeInputWithSlider
        initialValue={new Range(1, 7)}
        bounds={new Range(-10, 10)}
        // sizeBounds={new Range(0, 10)}
        boundingBox={BoundingBox.createByDimensions(0, 0, 500, 25)}
      />
      <div className="DndTest">
        <Resizable
          initialValue={BoundingBox.createByDimensions(50, 60, 200, 150)}
          sizesBounds={BoxSizesBounds.onlyMax(400, 400)}
        >
          <div className="Resizable" />
        </Resizable>
      </div>
      <VirtualViewWithButtons />
    </div>
  );
}

export default App;
