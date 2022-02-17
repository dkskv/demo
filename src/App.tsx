import makeStateful from "./decorators/makeStateful";
import DndTest from "./DndTest";
import { SliderWithInputs } from "./SliderWithInputs";

function App() {
  const SSliderWithInputs = makeStateful(SliderWithInputs);

  return (
    <div className="App">
      <SSliderWithInputs initialValue={{ start: 1, end: 5 }} />
      <DndTest />
    </div>
  );
}

export default App;
