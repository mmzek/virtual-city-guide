import { useState, useRef } from "react";
import PropTypes from "prop-types";
import LoadingBar from "react-top-loading-bar";
import "./SearchBar.css";
import "./MapView.jsx";

function SearchBar({ setPosition }) {
  const [query, setQuery] = useState("");
  const loadingBarRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    loadingBarRef.current.continuousStart();

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      query,
    )}&apiKey=52bdc0d1cd0b477aa438a932e9aee7cd`;

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
    loadingBarRef.current.complete();
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
SearchBar.propTypes = {
  setPosition: PropTypes.func.isRequired,
};
export default SearchBar;
