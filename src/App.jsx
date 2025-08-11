import MapView from "./components/MapView.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Attractions from "./components/Attractions.jsx";
import Planer from "./components/Planer.jsx";
import { useState, useEffect } from "react";
import "./App.css";
import WeatherForecast from "./components/WeatherForecast.jsx";

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
          setAddToPlaner={setAddToPlaner}
          setAttractions={setAttractions}
          attractions={attractions}
          position={position}

          onMarkersUpdate={setMarkers}
          selectedMarker={selectedMarker}
           onMarkerClick={setSelectedMarker}
          onClearSelection={() => setSelectedMarker(null)}
        ></Attractions>
      </div>

      <div className="child">
        <SearchBar setPosition={setPosition} />
      </div>
    </div>
  );
}

export default App;
