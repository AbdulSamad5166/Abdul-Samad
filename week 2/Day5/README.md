# Weather Checker

## Project Overview

Weather Checker is a responsive web application that looks up current weather conditions for a city using the OpenWeather Current Weather API. It presents the temperature, weather description, and a detailed set of atmospheric measurements in a clear dashboard.

## Features

- Search for a city using the search button, Enter key, or a popular-city shortcut
- Current temperature, condition, and weather icon
- Feels-like temperature, humidity, wind speed, pressure, visibility, cloudiness, and minimum/maximum temperatures
- Input validation, invalid-city feedback, loading state, and API/network error handling
- Remembers and automatically reloads the last successfully searched city with localStorage
- Responsive layout and animated interface for mobile, tablet, and desktop

## Technologies Used

- HTML5
- CSS3
- JavaScript
- OpenWeather API
- Font Awesome

## JavaScript Concepts Practiced

- Functions, parameters, arguments, return values, and arrow functions
- Arrays and objects, including destructuring and optional chaining
- ES6+ template literals, `const`/`let`, and nullish coalescing
- DOM selection and manipulation
- Events, callbacks, and form validation
- Local Storage and JSON
- Fetch API, Promises, and async/await
- Type conversion, conditional logic, and error handling

## Project Structure

```text
Day5/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

1. Create an API key in your OpenWeather account.
2. In `script.js`, replace `YOUR_OPENWEATHER_API_KEY` in the API configuration section with your key.
3. Open `index.html` in a browser. If your browser restricts requests from local files, run the folder with a local development server.
4. Search for a city to view its current weather.

The application runs directly in the browser and does not require a framework or package installation. The API key is used by the browser, so restrict it through your OpenWeather account where possible. Do not publish a real key in a public repository.

## API

The application requests current conditions from the OpenWeather Current Weather Data API and displays measurements in metric units. An OpenWeather API key is required. Do not put the actual key in this README or commit it to a public repository.

## Learning Outcome

This project practices connecting a browser interface to a real API, validating and displaying asynchronous data, handling loading and error states, and persisting a user's last search while keeping the code separated into HTML, CSS, and vanilla JavaScript.
