import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes, ThemeName, Theme } from "@/theme/colors";

type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [themeName, setThemeNameState] = useState<ThemeName>("light");

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("appTheme");

      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeNameState(savedTheme);
      } else {
        setThemeNameState(systemTheme === "dark" ? "dark" : "light");
      }
    };

    loadTheme();
  }, [systemTheme]);

  const setThemeName = async (name: ThemeName) => {
    setThemeNameState(name);
    await AsyncStorage.setItem("appTheme", name);
  };

  const toggleTheme = async () => {
    const newTheme = themeName === "light" ? "dark" : "light";
    await setThemeName(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeName],
        themeName,
        setThemeName,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return context;
};