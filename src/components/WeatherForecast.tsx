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

function WeatherForecast({}) {
  const { position } = useAppContext();
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
    // @ts-ignore
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
      <h1 className="pt-5 w-full inline-block text-center font-sans text-4xl text-(--color-light-pink) font-bold">
        Weather
      </h1>
      {loading && <div className="loader"></div>}
      {noData && (
        <div className="nodata">
          Weather is unavailable for the specified location
        </div>
      )}
      {!loading && !noData && weather && (
        <div>
          <div className="flex justify-center w-full">
            <div className="flex items-center w-80">
              <h2 className="font-sans text-5xl text-(--color-light-pink) font-bold">
                {weather.temp}
              </h2>
              <img
                className="mx-auto"
                src={weather.iconUrl ?? ""}
                alt="weather icon"
              />
              <h2 className="font-sans text-xl text-(--color-light-pink) font-bold">
                {weather.description}
              </h2>
            </div>
          </div>

          <h3 className="font-sans center text-center font-bold pb-4">
            {weather.time}
          </h3>

          <div className="flex justify-center w-full">
            <div className="grid grid-cols-2">
              <div className="grid grid-rows-2 text-center">
                <h2 className="font-sans font-bold">{weather.wind}</h2>
                <h2 className="font-sans font-bold">{weather.humidity}</h2>
              </div>
              <div className="grid grid-rows-2 text-center pl-4">
                <h2 className="font-sans font-bold">{weather.pressure}</h2>
                <h2 className="font-sans font-bold">{weather.cloudCover}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherForecast;
