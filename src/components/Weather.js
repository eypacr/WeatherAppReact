import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { CityContext } from "../context/CityContext";
import "../components/Weather.css";
import Lottie from "lottie-react";

import sunny from "../assets/sunny.json";
import cloudy from "../assets/cloudy.json";
import rain from "../assets/rain.json";
import snow from "../assets/snow.json";
import storm from "../assets/storm.json";
import fog from "../assets/fog.json";

import { enableDragScroll } from "../utils/drag-scroll";

function Weather() {
 
  const { selectedCity } = useContext(CityContext);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!selectedCity) {
      setWeather(null);
      return;
    }

    const getWeather = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.long}&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,cloudcover&timezone=auto`
        );

        setWeather(response.data);
      } catch (error) {
        console.error("Hava durumu verisi alınamadı", error);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, [selectedCity]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cleanup = enableDragScroll(slider);
    return () => cleanup && cleanup();
  }, [weather]);

  if (!selectedCity) {
    return <p>Lütfen bir şehir seçin.</p>;
  }

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!weather) {
    return <p>Hava durumu verisi bulunamadı.</p>;
  }

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: "Açık Güneşli",
      1: "Genellikle Güneşli",
      2: "Parçalı Bulutlu",
      3: "Kapalı",
      45: "Sisli",
      48: "Buz Sis",
      51: "Hafif Çiseleme",
      61: "Hafif Yağmur",
      71: "Hafif Kar",
      80: "Hafif Sağanak",
      95: "Fırtına",
    };
    return descriptions[code] || "Bilinmeyen Durum";
  };

  const getWeatherAnimation = (code) => {
    if (code === 0 || code === 1) return sunny;
    if (code === 2 || code === 3) return cloudy;
    if (code === 45 || code === 48) return fog;
    if (code === 51 || code === 61 || code === 80) return rain;
    if (code === 71) return snow;
    if (code === 95) return storm;
    return cloudy;
  };

  return (
    <>
      <div className={`weather-container`}>
        <h2>{selectedCity.name} Hava Durumu</h2>

        <div className="hourly-weather">
          <h3>Saatlik Hava Durumu</h3>
          <div
            className="hourly-scroll"
            ref={sliderRef}
            style={{ cursor: "grab" }}
          >
            {weather.hourly.time.map((time, index) => (
              <div key={index} className="hourly-card">
                <p>
                  <strong>
                    {String(new Date(time).getHours()).padStart(2, "0")}:00
                  </strong>
                </p>

                <p className="icon-wrapper icon-temp">
                  Sıcaklık: {weather.hourly.temperature_2m[index]}°C
                </p>

                <p className="icon-wrapper icon-humidity">
                  Nem: %{weather.hourly.relativehumidity_2m[index]}
                </p>

                <p className="icon-wrapper icon-wind">
                  Rüzgar: {weather.hourly.windspeed_10m[index]} km/h
                </p>

                <p className="icon-wrapper icon-cloud">
                  Bulut: %{weather.hourly.cloudcover[index]}
                </p>
              </div>
            ))}
          </div>
        </div>
        <h3>Haftalık Hava Durumu</h3>

        <div className="daily-weather-container">
          {weather.daily.time.map((date, index) => {
            const code = weather.daily.weathercode[index];
            const animation = getWeatherAnimation(code);
            return (
              <div key={index} className="weather-card">
                <strong>
                  {new Date(date).toLocaleDateString("tr-TR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </strong>
                <Lottie
                  animationData={animation}
                  loop={true}
                  style={{ width: 100, height: 100 }}
                />
                <p>{getWeatherDescription(code)}</p>
                <p>Maks: {weather.daily.temperature_2m_max[index]}°C</p>
                <p>Min: {weather.daily.temperature_2m_min[index]}°C</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Weather;
