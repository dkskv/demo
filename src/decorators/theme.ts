import { createContext, useContext } from "react";

export const defaultTheme = {
  primaryColor: "purple",
  backgroundColor: "grey",
  textColor: "white",
  largeIndent: 8,
  smallIndent: 4,
  scrollColor: "white",
  handleColor: "white",
  largeBorderRadius: 8,
  smallBorderRadius: 2,
  overlayColor: "rgba(0,0,0,0.5)",
  strokeColor: "grey",
};

export const ThemeContext = createContext(defaultTheme);

export function useTheme() {
  return useContext(ThemeContext);
}
