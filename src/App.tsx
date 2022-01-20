import DndTest from "./DndTest";
import Resizable from "./Resizable";
import Slider from "./Slider";

function App() {
  return (
    // Стоит ли использовать css in js?
    <div className="App">
      <Slider min={0} max={100} />
      <div style={{ display: "flex", gap: "20px" }}>
        <DndTest>
          <Resizable />
        </DndTest>
      </div>
    </div>
  );
}

export default App;
