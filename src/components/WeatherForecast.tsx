import "./WeatherForecast.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";

interface WeatherData {
  iconUrl: string | null;
  temp: string;
  feelsLike: string;
  time: string;
  wind: string;
  humidity: string;
  pressure: string;
  cloudCover: string;
  description: string;
}

function WeatherForecast({  }) {
  const {position }= useAppContext();
  const [lat, lon] = position;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    console.log("Position changed: " + position);
    getWeather();
  }, [position]);

  const getWeather = async () => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_WEATHER_KEY as string;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch", response);
        setNoData(true);
        return null;
      }

      const timezone = data.timezone;
      const localTime = new Date(Date.now() + timezone * 1000);

      const weather = {
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        temp: Math.round(data.main.temp - 272.15) + "°C",
        feelsLike:
          "Feels like: " + Math.round(data.main.feels_like - 272.15) + "°C",
        time: localTime.toLocaleString(),
        wind: "Wind speed: " + data.wind.speed + "km/h",
        humidity: "Humidity: " + data.main.humidity + "%",
        pressure: "Pressure: " + data.main.pressure + "mb",
        cloudCover: "Cloud cover: " + data.clouds.all + "%",
        description: data.weather[0].description,
      };
      setWeather(weather);
    } catch (err) {
      console.error("Qeury error:", err);
      setNoData(true);
    }
    setLoading(false);
    setNoData(false);
  };

  return (
    <div>
      <h1 className="h">Weather</h1>
      {loading && <div className="loader"></div>}
      {noData && (
        <div className="nodata">
          Weather is unavailable for the specified location
        </div>
      )}
      {!loading && !noData && weather && (
        <div className="row">
          <div className="column">
            <div className="row">
              <h2 className="h2">{weather.temp}</h2>
              <img src={weather.iconUrl ?? ""} alt="weather icon" />
            </div>
            <div className="column" style={{ alignItems: "center" }}>
              <h3 className="h3">{weather.feelsLike}</h3>
              <h3 className="h3">{weather.time}</h3>
            </div>
          </div>
          <div className="column">
            <h4
              className="h4"
              style={{ color: "lightpink", fontSize: "large", marginTop: 20 }}
            >
              {weather.description}
            </h4>
            <h4 className="h4">{weather.wind}</h4>
            <h4 className="h4">{weather.humidity}</h4>
            <h4 className="h4">{weather.pressure}</h4>
            <h4 className="h4">{weather.cloudCover}</h4>
          </div>
        </div>
      )}
    </div>
  );
}


export default WeatherForecast;
