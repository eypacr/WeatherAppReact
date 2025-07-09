import React, { useContext, useEffect, useState, useRef } from "react";
import { CityContext } from "../context/CityContext";
import "./CitySelector.css";

function CitySelector() {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { setSelectedCity } = useContext(CityContext);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then(setCities)
      .catch(() => console.error("Şehir verisi alınamadı"));
  }, []);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleSelect = (city) => {
    setSearchTerm(city.name);
    setSelectedCity(city);
    setShowSuggestions(false);
  };

  // On blur: öneri kutusu dışına tıklanırsa kapat
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="city-selector-container" ref={containerRef}>
      <input
        type="text"
        className="city-input"
        placeholder="Şehir ara..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        aria-autocomplete="list"
        aria-controls="city-suggestion-list"
        aria-expanded={showSuggestions}
        role="combobox"
      />

      {showSuggestions && filteredCities.length > 0 && (
        <ul
          className="city-suggestion-list"
          id="city-suggestion-list"
          role="listbox"
        >
          {filteredCities.map((city) => (
            <li
              key={city.name}
              className="city-suggestion-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(city)}
              role="option"
              aria-selected={searchTerm === city.name}
              tabIndex={-1}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySelector;
