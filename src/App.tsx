import Carousel from "./Carousel";
import DndTest from "./DndTest";
import NumberRangeInputWithSlider from "./NumberRangeInputWithSlider";

function App() {
  const testItems = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    content: `${i + 1}-й`
  }));

  return (
    <div className="App">
      <NumberRangeInputWithSlider
        initialValue={{ start: 1, end: 7 }}
        bounds={{ min: -20, max: 11 }}
        lengthBounds={{ min: 5 }}
        independentSlider={true}
      />
      <DndTest />
      <Carousel
        itemWidth={120}
        gutter={20}
        visibleCount={3}
        defaultKey={"5"}
        items={testItems}
      />
    </div>
  );
}

export default App;
