//The global variables
let apiKey = "227c2b4793ca0c16e450b597ecdebe79";
let currentUnit;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-btn");
currentLocationButton.addEventListener("click", getCurrentLocation);

//Default city for searching
searchCity("London");

//Searching a city
function searchCity(city) {
  currentUnit = getUnit();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
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
  console.log(response.data);
  //Show current city
  document.querySelector("#currentCity").innerHTML = response.data.name;

  city = response.data.name;

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

  //Call function to get apiUrl for daily forecast
  getDailyForecast(response.data.coord);
}

// Daily forecast
function getDailyForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${currentUnit}`;
  axios.get(apiUrl).then(displayDailyForecast);
}

//Display details of the daily forecast
function displayDailyForecast(response) {
  let forecast = response.data.daily;
  let dailyForecastElement = document.querySelector("#daily_forecast");
  let forecastHTML = ``;
  let unitWindSpeed = document.querySelector("#unit_speed_wind");

  forecast.slice(1).forEach(function (forecastDay, index) {
    let valueCurrentUnit;
    if (currentUnit === `metric`) {
      valueCurrentUnit = "°C";
    } else {
      valueCurrentUnit = "°F";
      unitWindSpeed.innerHTML = "miles/hour";
    }
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
                ><span class="convert_daily_units">${valueCurrentUnit}</span> •
                <span class="daily_temp_min">${Math.round(
                  forecastDay.temp.min
                )} </span
                ><span class="convert_daily_units">${valueCurrentUnit}</span>
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

//Geolocation
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;
  axios.get(url).then(displayWeather);
}

//Convert block
//For getting units
function getUnitImperial(event) {
  event.preventDefault();
  currentUnit = `imperial`;
  console.log(currentUnit);
  //remove the active class from the celsius link
  celsiusLink.classList.remove("active");
  //add the active class to the fahrenheit link
  fahrenheitLink.classList.add("active");
  searchCity(city);
}

function getUnitMetric(event) {
  event.preventDefault();
  currentUnit = `metric`;
  console.log(currentUnit);
  //add the active class from the celsius link
  celsiusLink.classList.add("active");
  //   //remove the active class from from the fahrenheit link
  fahrenheitLink.classList.remove("active");
  searchCity(city);
}

function getUnit() {
  let celsiusLink = document.querySelector(`#celsius-link`);
  if (celsiusLink.className === "active") {
    currentUnit = "metric";
  } else {
    currentUnit = "imperial";
  }
  return currentUnit;
}

let fahrenheitLink = document.querySelector(`#fahrenheit-link`);
fahrenheitLink.addEventListener("click", getUnitImperial);

let celsiusLink = document.querySelector(`#celsius-link`);
celsiusLink.addEventListener("click", getUnitMetric);
