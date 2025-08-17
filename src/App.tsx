import MapView from "./components/MapView.js";
import SearchBar from "./components/SearchBar.js";
import Attractions from "./components/Attractions.js";
import Planer from "./components/Planer.js";
import { AppContextProvider } from "./AppContext.tsx";
import { useState, useEffect } from "react";
import "./App.css";
import WeatherForecast from "./components/WeatherForecast.tsx";

function App() {
  return (
    <AppContextProvider>
      <div className="parent">
        <MapView />
        <div className="sidebar_left flex flex-col overflow-auto flex-1">
          <Planer />
        </div>
        <div className="sidebar flex flex-col overflow-auto flex-1">
          <WeatherForecast />
          <Attractions />
        </div>

        <div className="child">
          <SearchBar />
        </div>
      </div>
    </AppContextProvider>
  );
}

export default App;
