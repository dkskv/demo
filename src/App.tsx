import DndTest from "./DndTest";
import Slider from "./Slider";

function App() {
  return (
    <div className="App">
      <Slider min={0} max={100} />
      <DndTest />
    </div>
  );
}

export default App;
