import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ value, onChange, searchHandler, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-200 rounded-lg">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-sm bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
        aria-label="Search input"
      />

      {value && (
        <IoMdClose
          className="text-slate-500 cursor-pointer hover:text-black"
          onClick={onClearSearch}
          aria-label="Clear search"
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={searchHandler}
        aria-label="Search button"
      />
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  searchHandler: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default SearchBar;
