import CarouselWithButtons from "./CarouselWithButtons";
import DndTest from "./DndTest";
import NumberRangeInputWithSlider from "./NumberRangeInputWithSlider";
import { Constraints } from "./utils/constraints";
import { Range } from "./utils/range";

function App() {
  return (
    <div className="App">
      <NumberRangeInputWithSlider
        initialValue={new Range(1, 7)}
        constraints={new Constraints(-10, 10)}
        sizeConstraints={new Constraints(0, 10)}
      />
      <DndTest />
      <CarouselWithButtons />
    </div>
  );
}

export default App;
