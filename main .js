"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const API_key = "b94f3eaf6b9ebb14fd95cb363c90a6e0";
  const name = localStorage.getItem("name") || "User";
  document.getElementById("name").textContent = name;
  const location = localStorage.getItem("city") || "India";
  const locationNameEl = document.getElementById("location");
  const currentTempEl = document.getElementById("current-temp");
  const weatherDescriptionEl = document.getElementById("weather-description");
  const humidityEl = document.getElementById("humidity");
  const windSpeedEl = document.getElementById("wind-speed");
  const pressureEl = document.getElementById("pressure");
  const iconEl = document.getElementById("icon");
  const hourlyForecastContainer = document.getElementById("hourly-forecast");
  const dailyForecastContainer = document.getElementById("forecast-container");
  async function fetchWeatherData(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error.message);
      return null;
    }
  }

  async function fetchForecastData(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Forecast data not found");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error.message);
      return null;
    }
  }

  function updateCurrentWeather(data) {
    if (!data) return;
    locationNameEl.textContent = `${data.name}, ${data.sys.country}`;
    currentTempEl.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescriptionEl.textContent = data.weather[0].description;
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${data.wind.speed} m/s`;
    pressureEl.textContent = `${data.main.pressure} hPa`;
    iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    iconEl.alt = data.weather[0].description;
  }

  function updateForecast(data) {
    if (!data) return;
    hourlyForecastContainer.innerHTML = "";
    dailyForecastContainer.innerHTML = "";

    const hourlyData = data.list.slice(0, 8);
    hourlyData.forEach((entry) => {
      const hour = new Date(entry.dt * 1000).getHours();
      const temp = Math.round(entry.main.temp);
      const icon = entry.weather[0].icon;
      const forecastItem = document.createElement("div");
      forecastItem.className = "forecast-item";
      forecastItem.innerHTML = `
        <div>
          <span>${hour}:00</span>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon" />
          <span>${temp}°C</span>
        </div>
      `;
      hourlyForecastContainer.appendChild(forecastItem);
    });

    const days = {};
    data.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const day = date.toLocaleDateString(undefined, { weekday: "short" });
      if (!days[day]) {
        days[day] = entry;
      }
    });
    Object.keys(days).forEach((day) => {
      const entry = days[day];
      const temp = Math.round(entry.main.temp);
      const icon = entry.weather[0].icon;
      const dailyItem = document.createElement("div");
      dailyItem.className = "daily-item";
      dailyItem.innerHTML = `
        <span>${day}</span>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon" />
        <span>${temp}°C</span>
      `;
      dailyForecastContainer.appendChild(dailyItem);
    });
  }

  async function loadWeather(city) {
    const weatherData = await fetchWeatherData(city);
    updateCurrentWeather(weatherData);
    const forecastData = await fetchForecastData(city);
    updateForecast(forecastData);
  }

  // Initial load
  loadWeather(location);
});
document.querySelector(".butn").addEventListener("click", () => {
  console.log("old page opened");
  window.location.href = "index.html";
});
