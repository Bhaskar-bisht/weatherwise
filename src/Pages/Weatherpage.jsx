import React, { useState } from "react";
import "../css/Bootstrapcss.css";
import "../css/WeatherNew.css";

import clear from "../Assets/sun.gif";
import sunrise from "../Assets/sunrise.gif";
import sunset from "../Assets/sunset.gif";
import humidity from "../Assets/humidity.gif";
import uvlight from "../Assets/tanning.gif";
import wind from "../Assets/wind.gif";
import visibility from "../Assets/decision-making.gif";
import air from "../Assets/air-pollution.gif";
import hot from "../Assets/hot.gif";
import cold from "../Assets/cold.gif";
import temperature from "../Assets/temperature.gif";
import rain from "../Assets/rain.gif";
import cloudy from "../Assets/cloudy.gif";
import drizzle from "../Assets/drizzle.gif";
import mist from "../Assets/mist.gif";
import snow from "../Assets/snow.gif";
import storm from "../Assets/storm.gif";
import loading from "../Assets/loading.gif";

const Weatherpage = () => {
  const api_key = "787697605edd15a3bfde4a7847956af5";

  // const [airQuality, setAirQuality] = useState(null);
  const [wicon, setWicon] = useState(cloudy);

  const searchWeather = async () => {
    const element = document.getElementsByClassName("city-input");
    if (element[0].value === "") {
      alert("Please enter a city name");
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod && data.cod === "404") {
          alert("City not found");
          return;
        }

        // fetch next 7 day data



        const next_url = `https://api.openweathermap.org/data/2.5/forecast?q=${element[0].value}&units=Metric&appid=${api_key}`;

        fetch(next_url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch weather data");
            }
            return response.json();
          })
          .then((data) => {
            // console.log("API Response:", data);

            // Check if the expected data structure is present
            if (data.list && Array.isArray(data.list)) {
              // Create an object to store data for each date
              const dateWiseData = {};

              // Iterate through the forecast data
              data.list.forEach((forecast) => {
                // Extract the date of the forecast
                const forecastDate = new Date(
                  forecast.dt * 1000
                ).toLocaleDateString();

                // Check if the date exists in dateWiseData
                if (!dateWiseData[forecastDate]) {
                  dateWiseData[forecastDate] = [];
                }

                // Add the forecast data to the corresponding date's array
                dateWiseData[forecastDate].push(forecast);
              });

              // Log or use dateWiseData as needed
              // console.log("Date Wise Data:", dateWiseData);

              // Optionally, extract the next 7 days' data
              const next7DaysData = Object.values(dateWiseData).slice(0, 8);
              // console.log('Next 7 Days Data:', next7DaysData);
              const defaultWeatherElement =
                document.getElementById("defaultWeather");
              // Clear default weather text
              const weatherContainer =
                document.getElementById("weatherContainer");
              weatherContainer.innerHTML = "";

              next7DaysData.forEach((dayData) => {
                const dayElement = document.createElement("div");
                dayElement.className = "card";

                const dayName = new Date(
                  dayData[0].dt * 1000
                ).toLocaleDateString("en-US", { weekday: "short" });
                const dayTemp = dayData[0].main.temp.toFixed(2);
                const iconCode = dayData[0].weather[0].icon;
                // console.log(iconCode);
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
                const description = dayData[0].weather[0].description;

                dayElement.innerHTML = `
                <h4 class="next_1_day_name">${dayName}</h4>
                <img src="${iconUrl}" alt="Weather Icon">
                <p class="weather_description">${description}</p>
                <p class="next_1_day_temp">${dayTemp} <sup>°C</sup></p>
              `;
                // console.log(dayName);
                // console.log(dayTemp);

                weatherContainer.appendChild(dayElement);
              });
            } else {
              console.error("Invalid weather data format");
            }
          })
          .catch((error) =>
            console.error("Error fetching weather data:", error)
          );

        // ---------------------------------------------------------------

        const getCoordinatesAndAirQuality = async () => {
          try {
            // Step 1: Fetch latitude and longitude using Geocoding API
            const geoResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&appid=${api_key}`
            );

            if (!geoResponse.ok) {
              throw new Error("Failed to fetch geocoding data");
            }

            const geoData = await geoResponse.json();
            const { lat, lon } = geoData.coord;

            // Step 2: Fetch air quality data using Latitude and Longitude
            const airQualityResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
            );

            if (!airQualityResponse.ok) {
              throw new Error("Failed to fetch air quality data");
            }

            const airQualityData = await airQualityResponse.json();
            // console.log("Air Quality Data:", airQualityData);

            // Access specific air quality information as needed

            const airQuality = document.getElementsByClassName("airQuality");
            const aqi = airQualityData.list[0].main.aqi;
            // console.log("Air Quality Index (AQI):", aqi);

            airQuality[0].innerHTML = aqi + " Aqi";
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        // Call the function to get coordinates and air quality data
        getCoordinatesAndAirQuality();

        const temperature = document.getElementsByClassName("temp");
        const location = document.getElementsByClassName("city");
        const humidity = document.getElementsByClassName("humidity");
        const wind = document.getElementsByClassName("wind");
        const dateElement = document.getElementsByClassName("current-date");
        const descriptionElement =
          document.getElementsByClassName("description");
        const visibilityElement = document.getElementsByClassName("visibility");
        const uvIndexElement = document.getElementsByClassName("uv-index");
        const minTempElement = document.getElementsByClassName("min-temp");
        const maxTempElement = document.getElementsByClassName("max-temp");
        const sunriseElement = document.getElementsByClassName("sunrise");
        const sunsetElement = document.getElementsByClassName("sunset");

        const feelsLikeElement = document.getElementsByClassName("feels-like");

        // Get the current date
        const currentDate = new Date();
        const options = {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        };
        const formattedDate = currentDate.toLocaleDateString("en-US", options);

        temperature[0].innerHTML = data.main.temp + " °C";
        location[0].innerHTML = data.name;
        humidity[0].innerHTML = data.main.humidity + " %";
        wind[0].innerHTML = data.wind.speed + " Km/h";
        dateElement[0].innerHTML = `${formattedDate}`;
        feelsLikeElement[0].innerHTML = data.main.feels_like + " °C";

        // Check if the 'sys' object is present in the response
        if (data.hasOwnProperty("sys")) {
          const sunriseTimestamp = data.sys.sunrise;
          const sunsetTimestamp = data.sys.sunset;

          const sunriseTime = new Date(
            sunriseTimestamp * 1000
          ).toLocaleTimeString();
          const sunsetTime = new Date(
            sunsetTimestamp * 1000
          ).toLocaleTimeString();

          sunriseElement[0].innerHTML = ` ${sunriseTime}`;
          sunsetElement[0].innerHTML = ` ${sunsetTime}`;
        } else {
          sunriseElement[0].innerHTML = "Sunrise: Not available";
          sunsetElement[0].innerHTML = "Sunset: Not available";
        }

        // Check if the 'main' object is present in the response
        if (data.hasOwnProperty("main")) {
          const minTemp = data.main.temp_min;
          const maxTemp = data.main.temp_max;
          minTempElement[0].innerHTML = `${minTemp} °C`;
          maxTempElement[0].innerHTML = `${maxTemp} °C`;
        } else {
          minTempElement[0].innerHTML = "Not available";
          maxTempElement[0].innerHTML = "Not available";
        }

        // Check if the 'weather' array is present in the response
        if (data.weather && data.weather.length > 0) {
          const weatherDescription = data.weather[0].description;
          descriptionElement[0].innerHTML = ` ${weatherDescription}`;
        } else {
          descriptionElement[0].innerHTML = "Not available";
        }

        // Check if the 'visibility' field is present in the response
        if (data.hasOwnProperty("visibility")) {
          const visibility = data.visibility;
          const visibilityKilometers = visibility / 1000;
          visibilityElement[0].innerHTML = `${visibilityKilometers} Km`;
        } else {
          visibilityElement[0].innerHTML = " Not available";
        }

        // Check if the 'uvIndex' field is present in the response
        if (data.hasOwnProperty("uvIndex")) {
          const uvIndex = data.uvIndex;
          uvIndexElement[0].innerHTML = `${uvIndex}`;
        } else {
          uvIndexElement[0].innerHTML = " Not available";
        }

        // console.log(data.weather[0].icon);

        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
          setWicon(clear);
        } else if (
          data.weather[0].icon === "02d" ||
          data.weather[0].icon === "02n"
        ) {
          setWicon(cloudy);
        } else if (
          data.weather[0].icon === "03d" ||
          data.weather[0].icon === "03n"
        ) {
          setWicon(drizzle);
        } else if (
          data.weather[0].icon === "04d" ||
          data.weather[0].icon === "04n"
        ) {
          setWicon(drizzle);
        } else if (
          data.weather[0].icon === "09d" ||
          data.weather[0].icon === "09n"
        ) {
          setWicon(rain);
        } else if (
          data.weather[0].icon === "10d" ||
          data.weather[0].icon === "10n"
        ) {
          setWicon(drizzle);
        } else if (
          data.weather[0].icon === "11d" ||
          data.weather[0].icon === "11n"
        ) {
          setWicon(storm);
        } else if (
          data.weather[0].icon === "13d" ||
          data.weather[0].icon === "13n"
        ) {
          setWicon(snow);
        } else if (
          data.weather[0].icon === "50d" ||
          data.weather[0].icon === "50n"
        ) {
          setWicon(mist);
        } else {
          setWicon(clear);
        }
      });
  };

  return (
    <>
      <section className="weather">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 left-side-box">
              <div className="left-box">
                <div className="topbar">
                  <input
                    type="text"
                    className="city-input"
                    placeholder="Enter City..."
                  />
                  <button
                    className="btn"
                    onClick={() => {
                      searchWeather();
                    }}
                  >
                    Get Weather
                  </button>
                </div>
                <div className="weather-info">
                  <div className="temp-info">
                    <img src={wicon} alt="" />
                    <h1 className="temp">
                      {" "}
                      0 <sup>°C</sup>
                    </h1>
                  </div>
                  <div className="temp-other-info">
                    <h3 className="city">City Name</h3>
                    <h5>
                      <span className="current-date"> Day/Date</span>
                    </h5>
                  </div>
                  <hr />
                  <div className="other-info">
                    <div className="current-weather-info">
                      <img src={rain} alt="" />
                      <h3 className="description">Weather Description</h3>
                    </div>
                    <div className="current-weather-info">
                      <img src={temperature} alt="" />
                      <h3 className="feels-like">Feel like</h3>
                    </div>
                    <div className="current-weather-info">
                      <img src={cold} alt="" />
                      <h3 className="min-temp">Min Temp</h3>
                    </div>
                    <div className="current-weather-info">
                      <img src={hot} alt="" />
                      <h3 className="max-temp">Max Temp</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 right-side-box">
              <div className="header">
                <h2>WeatherWise</h2>
              </div>
              <hr className="m-0" />

              <div class="scrolling-wrapper" id="weatherContainer">
                <div id="defaultWeather" class="card">
                  <h4 class="defaultWeather-1"> Data Will Be Loading..</h4>
                  <img src={loading} alt="loading-img" />
                  <p class="defaultWeather-2">Please wait...</p>
                </div>
              </div>

              <div className="weather-other-info">
                <div class="container mt-5">
                  <div className="row">
                    <div className="col-lg-12 header">
                      <h2> Today's Highlights</h2>
                    </div>
                    <hr className="w-100" />
                    <div className="col-lg-4 highlights ">
                      <div className="highlights-box">
                        <div className="highlights-topbar">UV Index</div>
                        <div className="highlights-inner-box">
                          <div className="highlights-img">
                            <img src={uvlight} alt="" />
                          </div>
                          <div className="highlights-number">
                            <h2 className="uv-index">0</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 highlights ">
                      <div className="highlights-box">
                        <div className="highlights-topbar">Wind Speed</div>
                        <div className="highlights-inner-box">
                          <div className="highlights-img">
                            <img src={wind} alt="" />
                          </div>
                          <div className="highlights-number">
                            <h2 className="wind">0 km/h</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 highlights ">
                      <div className="highlights-box">
                        <div className="highlights-topbar">
                          Sunrise & Sunset
                        </div>
                        <div className=" sun-info">
                          <div className="sun-rise">
                            <img src={sunrise} alt="" />
                            <p className="sunrise">00:00 AM</p>
                          </div>
                          <div className="sun-set">
                            <img src={sunset} alt="" />
                            <p className="sunset">00:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 highlights ">
                      <div className="highlights-box">
                        <div className="highlights-topbar">Humidity</div>
                        <div className="highlights-inner-box">
                          <div className="highlights-img">
                            <img src={humidity} alt="" />
                          </div>
                          <div className="highlights-number">
                            <h2 className="humidity">0%</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 highlights ">
                      <div className="highlights-box">
                        <div className="highlights-topbar">Visibility</div>
                        <div className="highlights-inner-box">
                          <div className="highlights-img">
                            <img src={visibility} alt="" />
                          </div>
                          <div className="highlights-number">
                            <h2 className="visibility">0 K/m</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 highlights ">
                      <div className="highlights-box">
                        <div className="highlights-topbar">Air Quality</div>
                        <div className="highlights-inner-box">
                          <div className="highlights-img">
                            <img src={air} alt="" />
                          </div>
                          <div className="highlights-number">
                            <h2 className="airQuality">0</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="m-0" />
              <div className="footer">
                <div className="developer">
                  <h6>Ⓒ 2024 WEATHERWISE, All rights reserved</h6>
                  <h6>
                    Develop By : <span>Bhaskar Bisht</span>{" "}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Weatherpage;
