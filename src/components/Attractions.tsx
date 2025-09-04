import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import AttractionDetails from "./AttractionDetails.tsx";
import "./../App.css";
import "tailwindcss";
import { useAppContext } from "../AppContext.tsx";
import { AttractionsData } from "../AppContext.tsx";

function formatApiText(apiText) {
  if (!apiText) return "";
  if (apiText == "entertainment.museum") apiText = "Museum";
  if (apiText == "entertainment.culture") apiText = "Culture";
  return apiText
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Attractions({mobile}) {
  const {position, selectedMarker, attractions, setSelectedMarker, setAddToPlaner, markers, setAttractions, setMarkers, showLeftSideBar, setShowLeftSideBar, setShowRightSideBar, tasks}=useAppContext();
  const [lat, lon] = position;
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryName, setCategoryName] = useState("entertainment")
  const categories = [
    "entertainment",
    "catering",
    "entertainment.museum",
    "tourism",
    "activity",
    "entertainment.culture",
    "leisure",
    "national_park",
  ];

  function getBack() {
    setIndex(null);
    getAttractions();
    setSelectedMarker(null)
  }

  function categoriesButtonClicked() {
    showCategories ? setShowCategories(false) : setShowCategories(true);
  }

  function categoriesChosen(i) {
    setCategoryName( categories[i]);
    getAttractions();
  }

  useEffect(() => {
    console.log("Position changed: " + position);
    getAttractions();
  }, [position]);

  const getAttractions = async () => {
    setLoading(true);
    // @ts-ignore
     const apiKey = import.meta.env.VITE_GEOPIFY_KEY as string;
    const url = `https://api.geoapify.com/v2/places?categories=${categoryName}&filter=circle:${lon},${lat},3000&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch", response);
        setNoData(true);
        return null;
      }
      const attractions = data.features.map((feature) => ({
        name: feature.properties.name,
        attractionLon: feature.geometry.coordinates[0],
        attractionLat: feature.geometry.coordinates[1],
        amenity: formatApiText(feature.properties.datasource.raw.amenity),
        address: feature.properties.formatted,
        url: feature.properties.datasource.raw.website,
      }));
      const filtered = attractions.filter(
        (attraction) => attraction.name != null && attraction.amenity != null,
      );
      setAttractions(filtered);
      setMarkers(
        filtered.map((a) => ({
          position: [a.attractionLat, a.attractionLon],
          title: a.name,
        })),
      );
    } catch (err) {
      console.error("Qeury error:", err);
      setNoData(true);
    }
    setLoading(false);
    setNoData(false);
  };
  useEffect(() => {
    if (selectedMarker != null && attractions?.length > 0) {
      const i = attractions?.findIndex(
        (a) =>
          Math.abs(selectedMarker.position[0] - a.attractionLat) < 1e-6 &&
          Math.abs(selectedMarker.position[1] - a.attractionLon) < 1e-6,
      );
      setIndex(i);
    }
  }, [selectedMarker, attractions]);
  console.log(tasks)
  return (
    <div>
      {!mobile && <h1 className="py-5 w-full inline-block text-center font-sans text-4xl text-(--color-light-pink) font-bold">Tourist Attractions</h1>}
      {!loading && mobile && <h1 className="py-5 w-full inline-block text-center font-sans text-4xl text-(--color-light-pink) font-bold">Tourist Attractions</h1>}
      {!loading &&
        !noData &&
        selectedMarker != null &&
        index !== -1 &&
        index != null && (
          <button onClick={getBack} className="z-[1000] p-5">
            <img src="/back-arrow-icon.svg" className="h-5" />
          </button>
        )}
      {loading && <div className="loader"></div>}
      {noData && <div className="nodata"></div>}
      {!loading && !noData && selectedMarker == null && (
        <div>
          <div className="flex justify-center items-center">
            <button
              onClick={categoriesButtonClicked}
              className="inline-flex rounded-md bg-(--color-light-pink) px-3 py-2 text-sm font-bold shadow-lg hover:bg-(--color-pink)"
            >
              Categories
              {!showCategories && (
                <img src="/arrow-down.svg" className="h-5 p-1" />
              )}
              {showCategories && (
                <img src="/arrow-up.svg" className="h-5 p-1" />
              )}
            </button>
          </div>
          {showCategories && (
            <div className="flex justify-center items-center">
              <ul className="bg-white shadow-lg ring-1 ring-black/5">
                {categories.map((element, i) => (
                  <li
                    key={i}
                    tabIndex={0}
                    className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-gray-400"
                    onClick={() => categoriesChosen(i)}
                  >
                    {formatApiText(element)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {attractions?.length == 0 && (
            <div className="font-sans p-10">
              There are no attractions in category {formatApiText(categoryName)}!
            </div>
          )}
          <ul className="grid grid-cols-none gap-5 bg-clip-border p-8">
            {attractions.map((attraction, i) => (
              <li
                key={i}
                className="bg-neutral-100 flex items-center justify-between shadow-lg rounded-xl h-20 bg-clip-border col-span-2 p-2"
                onClick={() => setSelectedMarker(markers[i])}
              >
                <div className="font-sans font-bold">
                  {attraction.name}
                  <div className="font-normal font-sans ">
                    {attraction.amenity}
                  </div>{" "}
                </div>
                <img
                  onClick={(e) =>{ e.stopPropagation(); setShowLeftSideBar(true); setAddToPlaner(i); if(mobile && tasks.length==0){setShowRightSideBar(false)}; if(mobile && tasks.length!==0){setShowLeftSideBar(false); setShowRightSideBar(true)};}}
                  src="/icons-plus.svg"
                  className="h-7"
                ></img>
              </li>
            ))}{" "}
          </ul>{" "}
        </div>
      )}
{!loading &&
        !noData &&
        selectedMarker != null &&
        index !== -1 &&
        index != null && (
          <AttractionDetails attractions={attractions} index={index} mobile={mobile}/>
        )}{" "}
    </div>
  );
}

export default Attractions;
