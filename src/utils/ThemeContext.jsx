import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  currentTheme: "light",
  changeCurrentTheme: () => {
    // Empty function
  },
});

/**
 * ThemeProvider
 * @param {object} props - React children
 * @returns {object} React component
 */
export default function ThemeProvider(props) {
  const { children } = props;
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
 * @returns {object} Theme context
 */
export const useThemeProvider = () => useContext(ThemeContext);
