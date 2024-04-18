import { createContext, useState, useContext } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isDark, setDark] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isDark,
        setDark
      }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export default useAppContext;
