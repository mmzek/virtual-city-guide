import MapView from "./components/MapView.js";
import SearchBar from "./components/SearchBar.js";
import Attractions from "./components/Attractions.js";
import Planer from "./components/Planer.js";
import { useState, useEffect } from "react";
import "./App.css";
import WeatherForecast from "./components/WeatherForecast.tsx";

function App() {
  //Warsaw as a default
  const [position, setPosition] = useState([52.2297, 21.0122]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [addToPlaner, setAddToPlaner] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
    );
  }, []);

  return (
    <div className="parent">
      <MapView
        position={position}
        markers={markers}
        onMarkerClick={setSelectedMarker}
      />
      <div className="sidebar_left flex flex-col overflow-auto flex-1">
        <Planer attractions={attractions} addToPlaner={addToPlaner}></Planer>
      </div>
      <div className="sidebar flex flex-col overflow-auto flex-1">
        <WeatherForecast position={position}></WeatherForecast>
        <Attractions
          position={position}
          onMarkersUpdate={setMarkers}
          selectedMarker={selectedMarker}
          onClearSelection={() => setSelectedMarker(null)}
          attractions={attractions}
          setAttractions={setAttractions}
          setAddToPlaner={setAddToPlaner}
        ></Attractions>
      </div>

      <div className="child">
        <SearchBar setPosition={setPosition} />
      </div>
    </div>
  );
}

export default App;
