# ⛅ Aether Weather

> A sleek, glassmorphism-style weather app with real-time data, 5-day forecasts, and smooth animations.

---

## 📸 Project Overview

**Aether Weather** is a capstone web development project that fetches live weather data using the **OpenWeatherMap API**. It features a premium dark UI with floating orbs, glass-effect cards, an animated weather icon, a sunrise/sunset tracker, and a 5-day forecast — all in pure **HTML, CSS, and JavaScript**.

---

## 🛠️ Tools & Technologies Used

| Tool | Purpose |
|------|---------|
| HTML5 | Structure & semantic markup |
| CSS3 | Glassmorphism UI, animations, responsive layout |
| JavaScript (ES6+) | API calls, DOM manipulation, state management |
| OpenWeatherMap API | Live weather + 5-day forecast data |
| Google Fonts (Syne + DM Sans) | Typography |
| Font Awesome 6 | Icons |

---

## ✨ Features

- 🔍 **City Search** — Search any city worldwide
- 📍 **Auto-Location** — Detects your location via browser geolocation
- 🌡️ **Unit Toggle** — Switch between Celsius and Fahrenheit instantly
- 💨 **Live Stats** — Humidity, wind speed, visibility, pressure
- 🌅 **Sunrise / Sunset Tracker** — Animated sun arc with real position
- 📅 **5-Day Forecast** — Daily highs & lows with weather icons
- ⚡ **Quick City Buttons** — Jump to popular cities instantly
- 📱 **Fully Responsive** — Works on all screen sizes

---

## 🚀 How to Run

### Step 1 — Get a Free API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a **free account**
3. Navigate to **"My API Keys"** and copy your key
4. The free tier allows **60 calls/minute** — more than enough

### Step 2 — Add Your API Key

Open `js/app.js` and replace line 7:

```js
const API_KEY = "YOUR_API_KEY_HERE";
```

with your actual key:

```js
const API_KEY = "abc123yourkeyhere";
```

> ⚠️ **Note:** New API keys can take up to **10 minutes** to activate after registration.

### Step 3 — Open in VS Code

1. Open the project folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't already
3. Right-click `index.html` → **"Open with Live Server"**
4. The app opens in your browser at `http://127.0.0.1:5500`

> ✅ Do **not** open `index.html` by double-clicking it directly — browser CORS restrictions will block the API calls. Always use Live Server or a local server.

---

## 📁 Project Structure

```
weather-app/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles (glassmorphism, animations, responsive)
├── js/
│   └── app.js          # JavaScript logic + API integration
└── README.md           # This file
```

---

## 🎨 Design Highlights

- **Dark glassmorphism** with animated gradient orbs and a subtle grid overlay
- **Syne** display font for bold, modern headings
- **DM Sans** for clean, readable body text
- Floating weather icon with drop shadow
- Smooth fade-in/up animations on load
- Hover effects on all interactive cards

---

## 🔑 API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/weather` | Current weather by city name or coordinates |
| `/forecast` | 5-day / 3-hour forecast data |

---

## 📜 License

This project was built as a capstone project for educational purposes.  
Weather data provided by [OpenWeatherMap](https://openweathermap.org).

---

Made with ☁️ by **Aether Weather**
