import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = (props) => {
  const { userInfo, onSearchNote, handleClearSearch } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = () => {
    // Implement search logic here
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      onSearchNote(trimmedQuery);
    }
  }

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-bold text-black py-2'>Notes</h2>

      <SearchBar 
        value={searchQuery}
        searchHandler={searchHandler}
        onClearSearch={onClearSearch}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
      />

      {userInfo && <ProfileInfo userInfo={userInfo} logOut={onLogout} />}
    </div>
  )
}

export default Navbar;
