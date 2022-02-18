import makeStateful from "./decorators/makeStateful";
import DndTest from "./DndTest";
import NumberRangeInputWithSlider from "./NumberRangeInputWithSlider";

function App() {
  const SNumberRangeInputWithSlider = makeStateful(NumberRangeInputWithSlider);

  return (
    <div className="App">
      <SNumberRangeInputWithSlider
        initialValue={{ start: 1, end: 7 }}
        bounds={{ min: -20, max: 11 }}
        lengthBounds={{ min: 5 }}
        independentSlider={true}
      />
      <DndTest />
    </div>
  );
}

export default App;
