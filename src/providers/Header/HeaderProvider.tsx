/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

// types
import { HeaderContextType, HeaderProviderPropsType } from "./types";

const HeaderContext = createContext({} as HeaderContextType);

/**
 * Header Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const HeaderProvider = (props: HeaderProviderPropsType) => {
  const { children } = props;

  const [title, setTitle] = useState("");
  const [actions, setActions] = useState([]);

  const value = { title, setTitle, actions, setActions };
  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
};

/**
 * useHeader hook
 * @returns function hook
 */
const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined)
    throw new Error("accountContext must be used within a Provider");
  return context;
};

export { HeaderProvider, useHeader };
