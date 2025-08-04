import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./../App.css";
import "tailwindcss";

function Attractions({ position, onMarkersUpdate }) {
  const [lat, lon] = position;
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    console.log("Position changed: " + position);
    getAttractions();
  }, [position]);

  const getAttractions = async () => {
    setLoading(true);
    const url = `https://api.geoapify.com/v2/places?categories=building.entertainment&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=20&apiKey=52bdc0d1cd0b477aa438a932e9aee7cd`;
    console.log(url);
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
      }));

      setAttractions(attractions);
      onMarkersUpdate(
        attractions.map((a) => ({
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
  return (
    <div>
      <h1 className="h">Tourist Attractions</h1>
      {loading && <div className="loader"></div>}
      {noData && <div className="nodata"></div>}
      {!loading && !noData && (
        <ul className="grid grid-cols-none gap-5 bg-clip-border p-10 ">
          {attractions.map((attraction, i) => (
            <li
              key={i}
              className="bg-neutral-100 shadow-md rounded-xl h-15 font-sans font-bold bg-clip-border p-4"
            >
              {attraction.name}
            </li>
          ))}{" "}
        </ul>
      )}
    </div>
  );
}

Attractions.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  onMarkersUpdate: PropTypes.func.isRequired,
};

export default Attractions;
