const userInputEl = document.querySelector("#userInput");
const apiKey = "b42df58e582cf042e5545e718636c1df";
const apiUrl = "http://api.openweathermap.org/geo/1.0/direct";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
const buttonEl = document.querySelector("#searchBtn");
const cityNameEl = document.querySelector("#cityName");

userInputEl.addEventListener("change", () => {
    const userInput = userInputEl.value;
    const stateCode = ""; // Add the state code if needed
    const countryCode = ""; // Add the country code if needed
    const limit = 1; // Set the limit for the number of results

    const geoApiUrl = `${apiUrl}?q=${userInput},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;

    fetch(geoApiUrl)
        .then(response => response.json())
        .then(data => {
            // Assuming the API response contains latitude and longitude
            const latitude = data[0].lat;
            const longitude = data[0].lon;

            const forecastApiUrl = `${forecastUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            // Make a second API request using the latitude and longitude
            fetch(forecastApiUrl)
                .then(response => response.json())
                .then(forecastData => {
                    // Handle the forecast data here
                    console.log("Here's the info:", forecastData);

                    buttonEl.addEventListener("click", function(){
                        cityNameEl.textContent = forecastData.city.name;
                    });
                })
                .catch(error => {
                    console.error("Error fetching forecast data:", error);
                });
        })
        .catch(error => {
            console.error("Error fetching location data:", error);
        });
        
        
});

