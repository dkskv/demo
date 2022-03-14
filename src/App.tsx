import CarouselWithButtons from "./CarouselWithButtons";
import DndTest from "./DndTest";
import NumberRangeInputWithSlider from "./NumberRangeInputWithSlider";

function App() {
  return (
    <div className="App">
      <NumberRangeInputWithSlider
        initialValue={{ start: 1, end: 7 }}
        bounds={{ min: -20, max: 11 }}
        lengthBounds={{ min: 5 }}
        independentSlider={true}
      />
      <DndTest />
      <CarouselWithButtons />
    </div>
  );
}

export default App;
