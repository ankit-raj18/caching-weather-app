import "./styles.css";

const input = document.getElementById("inputWeather");
const weatherContainer = document.getElementById("container");
const cacheTime = 100000; //our cache time in milliseconds;
const cache = {}; //dynamically adding data here;
let cacheTimer = 0; //initialized to 0;

function getCacheTimer(time) {
  //function to calculate cache timer
  const now = new Date().getTime();
  if (cacheTimer < now + time) {
    cacheTimer = now + time;
  }
  return cacheTimer;
}

const fetchWeatherInfo = async (location) => {
  //fetching response from api
  let weatherInfo = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=ee4ccb7f2b97b3e7dfcdb42cf1313445`
  )
    .then((data) => data.json())
    .then((myJson) => (weatherInfo = myJson));
  return weatherInfo;
};

const fetchWithCache = async (location, time) => {
  //fetching data from cache
  const now = new Date().getTime();
  if (!cache[location] || cache[location].cacheTimer < now) {
    //check if it's not in cache or cache time has expired
    cache[location] = await fetchWeatherInfo(location); //update cache
    cache[location].cacheTimer = getCacheTimer(time); //update cache timer
  }
  return cache[location];
};

const displayWeatherData = async (location) => {
  //Weather data to be displayed
  const weatherInfo = await fetchWithCache(location.toLowerCase(), cacheTime); //fetching from cache
  if (!weatherInfo || !weatherInfo.weather) {
    weatherContainer.innerHTML = `There's an error with request`;
    return;
  }
  weatherContainer.innerHTML = `<p>${weatherInfo.name}</p><p>${
    weatherInfo.weather[0].main
  }<p><p>${weatherInfo.main.temp.toFixed()}°F</p>`;
  console.log(cache);
};

function init() {
  //main function
  input.addEventListener("change", updateValue);
  function updateValue(e) {
    displayWeatherData(e.target.value);
  }
}
init();