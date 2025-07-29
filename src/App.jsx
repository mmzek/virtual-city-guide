import MapView from "./components/MapView.jsx";
import SearchBar from "./components/SearchBar.jsx";
import "./App.css";

function App() {
  return (
    <div className="parent">
      <MapView />
      <div className="child">
        <SearchBar />
      </div>
    </div>
  );
}

export default App;
