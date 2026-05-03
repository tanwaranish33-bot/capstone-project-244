/* ============================
   AETHER WEATHER — app.js
   ============================ */

// ── CONFIG ──────────────────────────────────────────────
// IMPORTANT: Replace with your own free API key from https://openweathermap.org/api
const API_KEY = "a4c4362505cfcf210d1180770689cf1b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ── STATE ────────────────────────────────────────────────
let currentUnit = "metric"; // 'metric' = °C, 'imperial' = °F
let lastCity = "";

// ── DOM REFS ─────────────────────────────────────────────
const cityInput     = document.getElementById("city-input");
const searchBtn     = document.getElementById("search-btn");
const btnCelsius    = document.getElementById("btn-celsius");
const btnFahrenheit = document.getElementById("btn-fahrenheit");
const dashboard     = document.getElementById("dashboard");
const loading       = document.getElementById("loading");
const errorMsg      = document.getElementById("error-msg");
const errorText     = document.getElementById("error-text");
const forecastList  = document.getElementById("forecast-list");

// ── INIT ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 60000);
  autoDetectLocation();
});

// ── EVENTS ───────────────────────────────────────────────
searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSearch(); });

btnCelsius.addEventListener("click", () => {
  if (currentUnit !== "metric") {
    currentUnit = "metric";
    btnCelsius.classList.add("active");
    btnFahrenheit.classList.remove("active");
    document.getElementById("unit-label").textContent = "°C";
    if (lastCity) fetchWeather(lastCity);
  }
});

btnFahrenheit.addEventListener("click", () => {
  if (currentUnit !== "imperial") {
    currentUnit = "imperial";
    btnFahrenheit.classList.add("active");
    btnCelsius.classList.remove("active");
    document.getElementById("unit-label").textContent = "°F";
    if (lastCity) fetchWeather(lastCity);
  }
});

document.querySelectorAll(".quick-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    cityInput.value = btn.dataset.city;
    handleSearch();
  });
});

// ── SEARCH HANDLER ────────────────────────────────────────
function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) return;
  fetchWeather(city);
}

// ── AUTO-DETECT (Geolocation) ─────────────────────────────
function autoDetectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        // Silently fail — user can search manually
      }
    );
  }
}

// ── FETCH BY COORDS ───────────────────────────────────────
async function fetchWeatherByCoords(lat, lon) {
  showLoading(true);
  hideError();
  try {
    const [current, forecast] = await Promise.all([
      fetchJSON(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`),
      fetchJSON(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}`)
    ]);
    lastCity = current.name;
    renderWeather(current, forecast);
  } catch (err) {
    showError("Could not fetch your location's weather.");
  } finally {
    showLoading(false);
  }
}

// ── FETCH BY CITY NAME ────────────────────────────────────
async function fetchWeather(city) {
  showLoading(true);
  hideError();
  showDashboard(false);

  try {
    const [current, forecast] = await Promise.all([
      fetchJSON(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`),
      fetchJSON(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${currentUnit}&appid=${API_KEY}`)
    ]);
    lastCity = city;
    renderWeather(current, forecast);
  } catch (err) {
    if (err.status === 404) {
      showError(`City "${city}" not found. Check spelling and try again.`);
    } else if (err.status === 401) {
      showError("Invalid API key. Please add your OpenWeatherMap API key in js/app.js");
    } else {
      showError("Something went wrong. Please try again.");
    }
  } finally {
    showLoading(false);
  }
}

// ── RENDER ────────────────────────────────────────────────
function renderWeather(current, forecast) {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const windUnit   = currentUnit === "metric" ? "m/s" : "mph";

  // Hero
  document.getElementById("city-name").textContent    = current.name;
  document.getElementById("country-name").textContent = current.sys.country;
  document.getElementById("weather-desc").textContent = current.weather[0].description;
  document.getElementById("temp-main").textContent    = Math.round(current.main.temp);
  document.getElementById("unit-label").textContent   = unitSymbol;
  document.getElementById("feels-like").textContent   = `${Math.round(current.main.feels_like)}${unitSymbol}`;

  // Icon
  const iconCode = current.weather[0].icon;
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.getElementById("weather-icon").alt = current.weather[0].description;

  // Stats
  document.getElementById("humidity").textContent    = `${current.main.humidity}%`;
  document.getElementById("wind-speed").textContent  = `${current.wind.speed} ${windUnit}`;
  document.getElementById("visibility").textContent  = `${(current.visibility / 1000).toFixed(1)} km`;
  document.getElementById("pressure").textContent    = `${current.main.pressure} hPa`;

  // Sunrise / Sunset
  const tz = current.timezone; // offset in seconds
  document.getElementById("sunrise").textContent = formatUTCTime(current.sys.sunrise, tz);
  document.getElementById("sunset").textContent  = formatUTCTime(current.sys.sunset, tz);
  animateSunDot(current.sys.sunrise, current.sys.sunset);

  // 5-Day Forecast
  renderForecast(forecast, unitSymbol);

  showDashboard(true);
}

// ── FORECAST ──────────────────────────────────────────────
function renderForecast(data, unitSymbol) {
  // Get one entry per day (at ~12:00)
  const daily = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key  = date.toDateString();
    const hour = date.getUTCHours();
    if (!daily[key] || Math.abs(hour - 12) < Math.abs(new Date(daily[key].dt * 1000).getUTCHours() - 12)) {
      daily[key] = item;
    }
  });

  const days = Object.values(daily).slice(0, 5);

  forecastList.innerHTML = days.map(item => {
    const d       = new Date(item.dt * 1000);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const icon    = item.weather[0].icon;
    const high    = Math.round(item.main.temp_max);
    const low     = Math.round(item.main.temp_min);
    return `
      <div class="forecast-item">
        <div class="fc-day">${dayName}</div>
        <div class="fc-icon"><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${item.weather[0].description}" /></div>
        <div class="fc-temp-high">${high}${unitSymbol}</div>
        <div class="fc-temp-low">${low}${unitSymbol}</div>
      </div>
    `;
  }).join("");
}

// ── HELPERS ───────────────────────────────────────────────
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error("API Error");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function formatUTCTime(unixTimestamp, timezoneOffset) {
  const utcMs      = unixTimestamp * 1000;
  const localMs    = utcMs + timezoneOffset * 1000;
  const d          = new Date(localMs);
  const hours      = d.getUTCHours();
  const minutes    = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm       = hours >= 12 ? "PM" : "AM";
  const h12        = hours % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function animateSunDot(sunrise, sunset) {
  const now   = Math.floor(Date.now() / 1000);
  const total = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(now - sunrise, total));
  const progress = elapsed / total; // 0 → 1

  // Map progress to x position (10 → 190) along the arc
  const cx = 10 + progress * 180;
  // Parabola: y = 70 - (progress - 0.5)^2 * ... 
  const cy = 70 - 4 * 70 * (progress - 0.5) * (1 - (progress - 0.5));
  const dot = document.getElementById("sun-dot");
  if (dot) { dot.setAttribute("cx", cx); dot.setAttribute("cy", Math.max(0, Math.min(70, cy))); }
}

function updateClock() {
  const now = new Date();
  document.getElementById("local-time").textContent =
    now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function showLoading(state) {
  loading.classList.toggle("show", state);
}

function showDashboard(state) {
  dashboard.classList.toggle("show", state);
}

function showError(msg) {
  errorText.textContent = msg;
  errorMsg.classList.add("show");
}

function hideError() {
  errorMsg.classList.remove("show");
}
