/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

// types
import { ThemeContextType, ThemeMode, ThemeProviderPropsType } from "./types";

const ThemeContext = createContext({} as ThemeContextType);

/**
 * ThemeProvider
 * @param props - React children
 * @returns React component
 */
export default function ThemeProvider(props: ThemeProviderPropsType) {
  const { children } = props;
  const persistedTheme = localStorage.getItem("theme") as ThemeMode;
  const [theme, setTheme] = useState(persistedTheme || ThemeMode.light);

  const changeCurrentTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.add("[&_*]:!transition-none");

    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 1);

    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useThemeProvider
 * @returns {object} Theme context
 */
export const useThemeProvider = () => useContext(ThemeContext);
