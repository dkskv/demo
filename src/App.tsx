import Slider from "./Slider";

function App() {
  return (
    // Стоит ли использовать css in js?
    <div className="App">
      <Slider min={0} max={100}/>
    </div>
  );
}

export default App;
