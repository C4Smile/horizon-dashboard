import { ReactNode } from "react";

export type ThemeProviderPropsType = {
  children: ReactNode;
};

export enum ThemeMode {
  light = "light",
  dark = "dark",
}

export type ThemeContextType = {
  currentTheme: ThemeMode;
  changeCurrentTheme: (newTheme: ThemeMode) => void;
};
