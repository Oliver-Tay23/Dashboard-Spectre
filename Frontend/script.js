async function callApi(endpoint, outputId) {
  const output = document.getElementById(outputId);
  output.textContent = "Loading...";
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}

// Weather Card Related Code
const DEFAULT_COORDS = { lat: 53.8, lon: -1.55 }; // fallback if location is blocked

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail"
};


function weatherLabel(code) {
  return weatherCodeMap[code] || "—";
}

async function fetchWeather(lat, lon) {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=auto";

  const res = await fetch(url);
  const data = await res.json();

  localStorage.setItem("spectre_weather", JSON.stringify({ data: data, fetchedAt: Date.now() }));

  renderWeatherCard(data);
  fetchLocationName(lat, lon);
}

function renderWeatherCard(data) {
  const tempEl = document.getElementById("weatherTemp");
  const descEl = document.getElementById("weatherDesc");
  if (!tempEl) return;

  const temp = Math.round(data.current.temperature_2m);
  tempEl.textContent = temp + "°C";

  tempEl.classList.remove("temp-cold", "temp-mild", "temp-hot");
  if (temp < 10) {
    tempEl.classList.add("temp-cold");
  } else if (temp < 25) {
    tempEl.classList.add("temp-mild");
  } else {
    tempEl.classList.add("temp-hot");
  }

  descEl.textContent = weatherLabel(data.current.weather_code);
}

function loadWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) { fetchWeather(pos.coords.latitude, pos.coords.longitude); },
      function () { fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon); },
      { timeout: 4000 }
    );
  } else {
    fetchWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon);
  }
}

loadWeather();
setInterval(loadWeather, 60 * 60 * 1000);

/* Location Lookup */
async function fetchLocationName(lat, lon) {
  const locEl = document.getElementById("weatherLocation");
  if (!locEl) return;

  try {
    const url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat +
      "&longitude=" + lon + "&localityLanguage=en";
    const res = await fetch(url);
    const data = await res.json();
    locEl.textContent = data.city || data.locality || "Unknown location";
  } catch (err) {
    locEl.textContent = "";
  }
}

/* Clock Logic */

function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th"; // covers 11th–13th
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function updateClock() {
  const el = document.getElementById("cardDateTime");
  if (!el) return;

  const now = new Date();
  const weekday = now.toLocaleDateString("en-GB", { weekday: "long" });
  const day = now.getDate();
  const month = now.toLocaleDateString("en-GB", { month: "long" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

  el.textContent = weekday + " " + day + getOrdinalSuffix(day) + " " + month + ", " + time;
}

updateClock();
setInterval(updateClock, 1000);
