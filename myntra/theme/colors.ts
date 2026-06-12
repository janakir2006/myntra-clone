export const themes = {
  light: {
    mode: "light",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    card: "#FFFFFF",
    text: "#222222",
    mutedText: "#666666",
    border: "#E5E5E5",
    primary: "#FF3F6C",
    primaryLight: "#FFF4F4",
    icon: "#3E3E3E",
    error: "#D32F2F",
  },

  dark: {
    mode: "dark",
    background: "#121212",
    surface: "#1E1E1E",
    card: "#242424",
    text: "#F5F5F5",
    mutedText: "#B0B0B0",
    border: "#333333",
    primary: "#FF5C85",
    primaryLight: "#3A1F2A",
    icon: "#F5F5F5",
    error: "#EF5350",
  },
};

export type ThemeName = keyof typeof themes;
export type Theme = typeof themes.light;