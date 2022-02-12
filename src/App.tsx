import makeStateful from "./decorators/makeStateful";
import DndTest from "./DndTest";
import Slider from "./Slider";

function App() {
  const StatefulSlider = makeStateful(Slider);

  return (
    <div className="App">
      <StatefulSlider initialValue={{ start: 0.2, end: 0.5 }} trackThickness={15}/>
      <DndTest />
    </div>
  );
}

export default App;
