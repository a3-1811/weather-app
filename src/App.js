import React, { useState, useEffect, useRef } from "react";
const API = {
  baseURL: "http://api.openweathermap.org/data/2.5/weather",
  apiKey: "635dea70eab7fb3ee6f73c71d33f6dbe",
};
const App = () => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [error, setError] = useState("");
  const queryRef = useRef("");

  const getDate = (d) => {
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const fetchAPI = async (queryString) => {
    const reponse = await fetch(
      `${API.baseURL}?q=${queryString}&units=metric&APPID=${API.apiKey}`
    );
    const dataJSON = await reponse.json();
    if (dataJSON.cod === "404") {
      setError(dataJSON.message);
    }
    setWeather(dataJSON);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
 
    setQuery(value);

    if (queryRef.current) {
      clearTimeout(queryRef.current);
    }

    queryRef.current = setTimeout(() => {
      if(value.trim() === "") {
        setQuery("");
        fetchAPI("London")
      }else{
        fetchAPI(value)
      }
    }, 500);
  };

  useEffect(() => {
    async function fecthAPI() {
      const reponse = await fetch(
        `${API.baseURL}?q=London&units=metric&APPID=${API.apiKey}`
      );
      const dataJSON = await reponse.json();
      if (dataJSON.cod === "404") {
        setError(dataJSON.message);
      }
      setWeather(dataJSON);
      setQuery("");
    }
    fecthAPI();
  }, []);

  return (
    <div
      className={
        typeof weather.main != "undefined"
          ? weather.main.temp > 16
            ? "app warm"
            : "app"
          : "app"
      }
    >
      <main>
        <div className="search_bar">
          <input
            placeholder="Search ...."
            onChange={handleQueryChange}
            value={query}
          />
        </div>
        {typeof weather.main != "undefined" ? (
          <div>
            <div className="location-box">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
              <p>{getDate(new Date())}</p>
            </div>
            <div className="weather-box">
              <div className="temp">
                <p>
                  {Math.round(weather.main.temp)} <sup>o</sup>C
                </p>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
          <div className="error">{error}</div>
        )}
      </main>
    </div>
  );
};

export default App;
