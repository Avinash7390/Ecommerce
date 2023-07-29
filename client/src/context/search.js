import { useContext, useState, createContext } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

//custom hook..

const useSearch = () => {
  return useContext(SearchContext);
};

export { useSearch, SearchProvider };
