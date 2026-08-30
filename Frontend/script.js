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
  0: "Clear Sky",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Light Freezing Drizzle",
  57: "Dense Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Rain Showers",
  81: "Rain Showers",
  82: "Violent Rain Showers",
  85: "Light Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Thunderstorm with Heavy Hail"
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
