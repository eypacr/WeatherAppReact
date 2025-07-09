import React from "react";
import { CityProvider } from "./context/CityContext";
import { ThemeProvider } from "./context/ThemeContext";
import CitySelector from "./components/CitySelector";
import Weather from "./components/Weather";

function App() {
  return (
    <ThemeProvider>
      <CityProvider>
        <AppContent />
      </CityProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, toggleTheme } = React.useContext(
    require("./context/ThemeContext").ThemeContext
  );

  return (
    <div className={`App weather-container ${theme}`}>
      <h1>Türkiye Hava Durumu</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <CitySelector />
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === "dark" ? "Açık Tema" : "Koyu Tema"}
        </button>
      </div>
      <Weather />
    </div>
  );
}

export default App;
