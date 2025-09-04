import MapView from "./components/MapView.js";
import SearchBar from "./components/SearchBar.js";
import Attractions from "./components/Attractions.js";
import Planer from "./components/Planer.js";
import { AppContextProvider, useAppContext } from "./AppContext.tsx";
import { useState, useEffect } from "react";
import "./App.css";
import WeatherForecast from "./components/WeatherForecast.tsx";
import { listeners } from "process";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

function AppContent({}) {
  const {
    showLeftSideBar,
    setShowLeftSideBar,
    showRightSideBar,
    setShowRightSideBar,
    setAddToPlaner,
  } = useAppContext();
  const mobile = useIsMobile();
  return (
    <div className="absolute w-full h-full z-0">
      <MapView />
      {showLeftSideBar && (
        <div className="flex">
          {/* desktop */}
          {!mobile && (
            <div className="w-120 min-w-[250px] z-[1000]  fixed top-0 left-0 h-screen">
              <div className="absolute top-1/100 left-0 w-full h-98/100 z-1000 rounded-r-2xl border border-gray-300 shadow-gray-400 shadow-2xl bg-white overflow-auto custom-scrollbar-left">
                <button
                  onClick={() => setShowLeftSideBar(false)}
                  className="z-[1000] absolute pt-4 px-4"
                >
                  <img src="/sidebar-hide.svg" className="h-7" />
                </button>
                <Planer />
              </div>
            </div>
          )}
          {/* mobile left sidebar*/}
          {mobile && (
            <div className="w-full p-4 z-[1000] fixed top-0 left-0 h-screen">
              <div className="absolute top-1/100 left-0 w-full h-98/100 z-1000 rounded-2xl border border-gray-300 shadow-gray-400 shadow-2xl bg-white overflow-auto">
                <button
                  onClick={() => {
                    setShowRightSideBar(true);
                    setShowLeftSideBar(false);
                  }}
                  className="absolute z-[1000] p-4"
                >
                  <img src="/back-arrow-icon.svg" className="h-5" />
                </button>
                <Planer />
              </div>
            </div>
          )}
        </div>
      )}
      {showRightSideBar && (
        <div className="flex">
          {/* desktop */}
          {!mobile && (
            <div className="w-120 min-w-[250px] z-[1000]  fixed top-0 right-0 h-screen">
              <div className="absolute top-1/100 right-0 w-full h-98/100 z-1000 rounded-l-2xl border border-gray-300 shadow-gray-400 shadow-2xl bg-white overflow-auto">
                <button
                  onClick={() => setShowRightSideBar(false)}
                  className="z-[1000] absolute pt-4 px-4"
                >
                  <img src="/sidebar-open.svg" className="h-7" />
                </button>
                <WeatherForecast />
                <Attractions mobile={mobile} />
              </div>
            </div>
          )}
          {/* mobile right sidebar*/}
          {mobile && (
            <div className="w-full p-4 z-[1000] fixed top-1/2 h-screen">
              <div className="absolute top-1/100 right-0 w-full h-98/100 z-1000 rounded-2xl border border-gray-300 shadow-gray-400 shadow-2xl bg-white overflow-auto">
                <button className="absolute z-[1000] p-4 right-0">
                  <img
                    src="/go-to-planer-icon.svg"
                    onClick={() => {
                      setShowRightSideBar(false);
                      setShowLeftSideBar(true);
                    }}
                    className="h-7"
                  />
                </button>
                <WeatherForecast />
                <Attractions mobile={mobile} />
              </div>
            </div>
          )}
        </div>
      )}
      {!showLeftSideBar && !mobile && (
        <div className="absolute top-1/100 left-0 w-11 h-98/100 z-1000 rounded-r-2xl border border-gray-300 shadow-gray-400 shadow-2xl bg-white">
          <button
            onClick={() => {
              setShowLeftSideBar(true);
              setAddToPlaner(null);
            }}
            className="z-[1000] pt-4 px-2"
          >
            <img src="/sidebar-open.svg" className="h-7" />
          </button>
        </div>
      )}
      {!showRightSideBar && !mobile && (
        <div className="absolute top-1/100 right-0 w-11 h-98/100 z-1000 rounded-l-2xl border border-gray-300 shadow-gray-400 shadow-2xl bg-white">
          <button
            onClick={() => setShowRightSideBar(true)}
            className="z-[1000] pt-4 px-2"
          >
            <img src="/sidebar-hide.svg" className="h-7" />
          </button>
        </div>
      )}
      <div className="absolute top-10 left-0 w-full z-999">
        <SearchBar />
      </div>
    </div>
  );
}

export default App;
