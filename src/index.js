//The global variables
let apiKey = "227c2b4793ca0c16e450b597ecdebe79";
let units = "metric";

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

//Default city for searching
searchCity("London");

//Searching a city
function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  if (city.length > 0) {
    searchCity(city);
  } else alert("Enter a city name!");
}

//Display details of weather today
function displayWeather(response) {
  //Show current cuty
  document.querySelector("#currentCity").innerHTML = response.data.name;

  //Show current temperature
  document.querySelector("#current_temp").innerHTML = Math.round(
    response.data.main.temp
  );

  //Show Humidity
  document.querySelector("#current_humidity").innerHTML =
    response.data.main.humidity;

  //Show wind
  document.querySelector("#current_wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  //Show description
  document.querySelector("#current_description").innerHTML =
    response.data.weather[0].description;

  //Show icon
  let iconCurrent = document.querySelector("#icon");
  iconCurrent.setAttribute(
    "src",
    `images/icon/${response.data.weather[0].icon}.svg`
  );
  iconCurrent.setAttribute("alt", response.data.weather[0].description);

  //Show current day
  document.querySelector("#current_day").innerHTML = formatDailyForecastDate(
    response.data.dt
  );

  //Show last updated time
  document.querySelector("#last_updated_time").innerHTML = formatUpdateTime(
    response.data.dt
  );

  getDailyForecast(response.data.coord);
}

// Daily forecast
function getDailyForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayDailyForecast);
}

//Display details of the daily forecast
function displayDailyForecast(response) {
  let forecast = response.data.daily;
  let dailyForecastElement = document.querySelector("#daily_forecast");
  let forecastHTML = ``;

  forecast.slice(1).forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += ` <div class="row daily_row_forecast">
              <div class="col-md-3 my-auto">${formatDailyForecastDate(
                forecastDay.dt
              )}</div>
              <div class="col-md-3 my-auto text-center">${formatDailyForecastDayMonth(
                forecastDay.dt
              )}</div>

              <div class="col-md-3 my-auto">
                <img src="images/icon/${
                  forecastDay.weather[0].icon
                }.svg" alt="${
        forecastDay.weather[0].description
      }" class="img_daily"/>
              </div>

              <div class="col-md-3 my-auto">
                <span class="daily_temp_max">${Math.round(
                  forecastDay.temp.max
                )} </span
                ><span class="convert_daily_units">°C</span> •
                <span class="daily_temp_min">${Math.round(
                  forecastDay.temp.min
                )} </span
                ><span class="convert_daily_units">°C</span>
              </div>
            </div>`;
    }
  });
  dailyForecastElement.innerHTML = forecastHTML;
}

//Functions to convert date format
function formatUpdateTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function formatDailyForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  // let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function formatDailyForecastDayMonth(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let DayMonth = `${day}.${month}`;
  return DayMonth;
}
