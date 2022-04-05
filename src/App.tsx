import CarouselWithButtons from "./CarouselWithButtons";
import DndTest from "./DndTest";
import NumberRangeInputWithSlider from "./NumberRangeInputWithSlider";
import { Bounds } from "./utils/bounds";
import { Range } from "./utils/range";

function App() {
  return (
    <div className="App">
      <NumberRangeInputWithSlider
        initialValue={new Range(1, 7)}
        bounds={new Bounds(-10, 10)}
        sizeBounds={new Bounds(0, 10)}
      />
      <DndTest />
      <CarouselWithButtons />
    </div>
  );
}

export default App;
