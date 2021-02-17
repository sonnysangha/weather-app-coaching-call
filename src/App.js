import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";

function App() {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const inputRef = useRef(null);
  const [image, setImage] = useState("");
  const [magicNumbers, setMagicNumbers] = useState([
    12,
    24,
    50,
    34,
    99,
    23,
    40,
  ]);
  const [totalOfMagicNumbers, setTotalOfMagicNumbers] = useState(0);

  useEffect(() => {
    fetchWeatherInfo();
  }, []);

  useEffect(() => {
    // If magicNumbers change, recalculate...
    const total = magicNumbers.reduce(
      (total, magicNumber) => total + magicNumber,
      0
    );

    setTotalOfMagicNumbers(total);
  }, [magicNumbers]);

  const fetchWeatherInfo = (e) => {
    e?.preventDefault();

    const options = {
      method: "GET",
      url: "https://community-open-weather-map.p.rapidapi.com/weather",
      params: {
        q: inputRef.current.value || "London, uk", // "London, uk"
        units: "metric",
      },
      headers: {
        "x-rapidapi-key": "d8e463825dmsh8d363baa76abe9dp17a9d3jsnd711c26ef1fc",
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
      },
    };

    const response = axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setWeatherInfo(response.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    determineBackgroundImage();
  }, [weatherInfo]);

  const determineBackgroundImage = () => {
    if (weatherInfo?.main.temp < 10) {
      setImage(
        "https://images.unsplash.com/photo-1519944159858-806d435dc86b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
      );
    }

    if (weatherInfo?.main.temp >= 10) {
      setImage(
        "https://images.unsplash.com/uploads/14122598319144c6eac10/5f8e7ade?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1814&q=80"
      );
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${image})` }}>
      <div className="app__container">
        <h1>Our weather app</h1>

        <div className="app__info app__left">
          <h3>Your magic numbers: {magicNumbers.join(", ")}</h3>
          <h4>The total of the magic numbers: {totalOfMagicNumbers}</h4>

          <form>
            <input ref={inputRef} type="text" placeholder="Type the city" />
            <button onClick={fetchWeatherInfo} type="submit">
              Show me the weather
            </button>
          </form>
        </div>

        <div className="app__info app__right">
          <h2>{weatherInfo?.name}</h2>
          <h2>{weatherInfo?.main.temp} Degrees Celsius</h2>
          <h3>
            {weatherInfo &&
              `Sunrise: ${moment
                .unix(weatherInfo?.sys?.sunrise)
                .format("LLLL")}`}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default App;
