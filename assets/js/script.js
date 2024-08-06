const userInputEl = document.querySelector("#userInput");
const apiKey = "b42df58e582cf042e5545e718636c1df";
const apiUrl = "http://api.openweathermap.org/geo/1.0/direct";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
const buttonEl = document.querySelector("#searchBtn");
const cityNameEl = document.querySelector("#cityName");
const displayEl = document.querySelector("#displayData");
const fiveDayForecast = document.querySelector("#fiveDay");




const displayContent = () => {
  const userInput = userInputEl.value;
  const stateCode = ""; // Add the state code if needed
  const countryCode = ""; // Add the country code if needed
  const limit = 1; // Set the limit for the number of results

  const geoApiUrl = `${apiUrl}?q=${userInput},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;


  fetch(geoApiUrl)
    .then(response => response.json())
    .then(data => {
      const cityName = data[0].name;

      // let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
      // searchHistory.push(cityName);
      // localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

      // displaySearchHistory();
      // Assuming the API response contains latitude and longitude
      const latitude = data[0].lat;
      const longitude = data[0].lon;

      const forecastApiUrl = `${forecastUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

      // Make a second API request using the latitude and longitude
      fetch(forecastApiUrl)
        .then(response => response.json())
        .then(forecastData => {
          // Handle the forecast data here
          console.log("Here's the info:", forecastData);

          showWeather(cityName, forecastData);


        })
        .catch(error => {
          console.error("Error fetching forecast data:", error);
        });
    })
    .catch(error => {
      console.error("Error fetching location data:", error);
    });


};

// const displaySearchHistory = () => {
//     const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
//     const searchHistoryEl = document.querySelector("#searchHistory");
//     searchHistoryEl.innerHTML = '';

// };

const showWeather = (cityName, forecastData) => {
  displayEl.innerHTML = '';
  fiveDayForecast.innerHTML = '';
  let weatherIconClass = '';

  if (forecastData.list[0].weather[0].main === "Rain") {
    weatherIconClass = 'bi bi-cloud-rain';
  } else if (forecastData.list[0].weather[0].main === "Clouds") {
    weatherIconClass = 'bi bi-clouds';
  }

  const weatherCard =

    `<div class="card mx-auto" style="width: 36rem;">
    <h2>${forecastData.city.name} (${dayjs(forecastData.list[0].dt_txt).format('MM/DD/YYYY')})<i class="${weatherIconClass}"></i></h2>
    
    <div class="card-body">
      <p class="card-text"><b>Temp: ${forecastData.list[0].main.temp}°F</b></p>
      <p class="card-text"><b>Wind: ${forecastData.list[0].wind.speed}MPH</b></p>
      <p class="card-text"><b>Humidity: ${forecastData.list[0].main.humidity}%</b></p>
    </div>
  </div>`;

  displayEl.innerHTML += weatherCard;

  for (let i = 0; i < forecastData.list.length; i += 8) {

    let weatherIconClass = '';

    if (forecastData.list[i].weather[0].main === "Rain") {
      weatherIconClass = 'bi bi-cloud-rain';
    } else if (forecastData.list[i].weather[0].main === "Clouds") {
      weatherIconClass = 'bi bi-clouds';
    } else if (forecastData.list[i].weather[0].main === "Clear") {
      weatherIconClass = 'bi bi-brightness-high';
    }


    const fiveDayCard =

      `<div class="card mx-auto" style="width: 18rem;">
    <h2>${dayjs(forecastData.list[i].dt_txt).format('MM/DD/YYYY')}<i  class="${weatherIconClass}"></i></h2>
    
    <div class="card-body">
      <p class="card-text"><b>Temp: ${forecastData.list[i].main.temp}°F</b></p>
      <p class="card-text"><b>Wind: ${forecastData.list[i].wind.speed}MPH</b></p>
      <p class="card-text"><b>Humidity: ${forecastData.list[i].main.humidity}%</b></p>
    </div>
    </div>`;
    fiveDayForecast.innerHTML += fiveDayCard;
  }
  cityNameEl.textContent = forecastData.city.name;
};

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function addToSearchHistory(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName)
  }
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}
function renderSearchHistory() {
  const searchHistoryDiv = document.getElementById('searchHistory');
  searchHistoryDiv.innerHTML = '';

  searchHistory.forEach(city => {
    const button = document.createElement('button');
    button.textContent = city;
    button.classList.add('btn', 'btn-secondary', 'm-1', 'col-3');
    button.addEventListener('click', () => {
      // Implement functionality to display weather data for the selected city
      // For example, you can call a function to fetch weather data for the selected city
      userInputEl.value = city;
      displayContent();
    });

    searchHistoryDiv.appendChild(button);
  });
}

// Event listener for the search button
document.getElementById('searchBtn').addEventListener('click', function () {
  const userInput = document.getElementById('userInput').value;
  addToSearchHistory(userInput);
  renderSearchHistory();
});



// showWeather();
buttonEl.addEventListener("click", displayContent);

renderSearchHistory();

