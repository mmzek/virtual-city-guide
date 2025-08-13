import { useState, useRef } from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";
import "./MapView.jsx";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useAppContext } from "../AppContext.js";

function SearchBar({  }) {
  const {setPosition} = useAppContext();
  const loadingBarRef = useRef<LoadingBarRef>(null);
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    loadingBarRef.current?.continuousStart();
    const apiKey = import.meta.env.VITE_GEOPIFY_KEY as string;
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      query,
    )}&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features.length > 0) {
        const { lat, lon } = data.features[0].properties;
        setPosition([lat, lon]);
        console.log("Found:", lat, lon);
      } else {
        alert("Loction not found");
      }
    } catch (err) {
      console.error("Qeury error:", err);
    }
    loadingBarRef.current?.complete();
  };
  return (
    <div>
      <LoadingBar color="lightpink" ref={loadingBarRef} />
      <header className="header">Virtual City Guide</header>
      <form>
        <label className="label">
          <input
            value={query}
            onChange={(q) => setQuery(q.target.value)}
            className="search-input"
            placeholder="Search location..."
          />
          <button className="button" onClick={handleSearch}>
            Search
          </button>
        </label>
      </form>
    </div>
  );
}
export default SearchBar;
