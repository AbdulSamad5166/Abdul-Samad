# Week 2 Day 4

A responsive weather checker built with HTML, CSS, and JavaScript. Search for a city to view its current weather conditions from OpenWeather.

## Features

- Search by city using the Search button or Enter key
- Quick searches for London, Tokyo, New York, and Paris
- Current temperature, feels-like temperature, and weather description
- Humidity, wind speed, pressure, visibility, cloudiness, and min/max temperature
- Remembers the last successfully searched city in browser storage
- Responsive layout with loading and error states

## Run

1. Get an API key from [OpenWeather](https://openweathermap.org/api).
2. In `script.js`, replace `YOUR_OPENWEATHER_API_KEY` with your API key.
3. Open `index.html` in a browser.

The app uses the OpenWeather Current Weather Data API with metric units. The API key is used by the browser, so restrict it in your OpenWeather account if possible. Do not commit a real API key.

## Files

- `index.html` — app structure and accessible UI
- `style.css` — responsive styling
- `script.js` — weather API requests and app interactions
