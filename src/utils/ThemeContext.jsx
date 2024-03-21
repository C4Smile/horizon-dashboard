import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  currentTheme: "light",
  changeCurrentTheme: () => {},
});

/**
 * ThemeProvider
 * @param {object} children - React children
 * @returns {object} React component
 */
export default function ThemeProvider({ children }) {
  const persistedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(persistedTheme || "light");

  const changeCurrentTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.add("[&_*]:!transition-none");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }

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
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeProvider = () => useContext(ThemeContext);
