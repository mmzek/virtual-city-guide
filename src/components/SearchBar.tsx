import { useState, useRef } from "react";
import PropTypes from "prop-types";
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
    //@ts-ignore
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
            <LoadingBar color="pink" height={4} ref={loadingBarRef} />
<header
  className="font-sans text-5xl text-center text-white"
  style={{
    textShadow: "4px 4px 4px rgb(251, 150, 165), 0 0 30px rgb(250, 0, 0),-2px 0 lightpink, 0 2px lightpink, 2px 0 lightpink, 0 -2px lightpink"
  }}
>
  Virtual City Guide
</header>
      <form className="pt-5 w-full flex items-center justify-center">
        <div className="bg-white w-100 h-10 z-[1000] outline-(--color-light-pink) outline-2 rounded-3xl  shadow-[5px_5px_5px_var(--color-light-pink)] flex items-center px-1">
          <input
            value={query}
            onChange={(q) => setQuery(q.target.value)}
            className="font-sans bg-transparent text-black placeholder-[var(--color-light-pink)] font-medium outline-none p-2 px-4"
            placeholder="Search location..."
          />
        <button className="p-1 ml-auto hover:bg-[#fb96a5] w-25 bg-(--color-light-pink) text-white rounded-4xl" onClick={handleSearch}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
export default SearchBar;
