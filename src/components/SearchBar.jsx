import "./SearchBar.css";

function SearchBar() {
  return (
    <form>
      <label className="label" htmlFor="site-search">
        <input className="search-input" placeholder="Search..." />
      </label>
    </form>
  );
}

export default SearchBar;
