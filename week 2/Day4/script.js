// ==========================================
// API CONFIGURATION
// ==========================================

const API_KEY = "YOUR_OPENWEATHER_API_KEY";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";


// ==========================================
// SELECT HTML ELEMENTS
// ==========================================

const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const searchBtnText = document.querySelector("#searchBtnText");
const errorMessage = document.querySelector("#errorMessage");

const weatherContainer = document.querySelector("#weatherContainer");
const welcomeMessage = document.querySelector("#welcomeMessage");

const cityName = document.querySelector("#cityName");
const countryName = document.querySelector("#countryName");
const weatherIcon = document.querySelector("#weatherIcon");
const weatherCondition = document.querySelector("#weatherCondition");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feelsLike");

const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const pressure = document.querySelector("#pressure");
const visibility = document.querySelector("#visibility");
const cloudiness = document.querySelector("#cloudiness");
const minMax = document.querySelector("#minMax");

const hintChips = document.querySelectorAll(".hint-chip");


// ==========================================
// EVENT LISTENERS
// ==========================================

// Search button click
searchBtn.addEventListener("click", () => {
    getWeather();
});

// Enter key press in city input
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

// Clear error message when user starts typing
cityInput.addEventListener("input", () => {
    if (errorMessage.textContent !== "") {
        clearError();
    }
});

// Quick city suggestions
hintChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        const selectedCity = chip.getAttribute("data-city");
        if (selectedCity) {
            cityInput.value = selectedCity;
            getWeather();
        }
    });
});

// Automatically load last searched city on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedCity = localStorage.getItem("lastSearchedCity");

    if (savedCity) {
        cityInput.value = savedCity;
        getWeather();
    }
});


// ==========================================
// CORE FUNCTIONS
// ==========================================

/**
 * Fetch weather data from OpenWeather API
 */
async function getWeather() {
    const city = cityInput.value.trim();

    // 1. Empty Input Validation
    if (city === "") {
        showError("Please enter correct city name");
        return;
    }

    // 2. Loading State
    searchBtn.disabled = true;
    searchBtn.classList.add("loading");
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> <span>Searching...</span>';

    clearError();

    try {
        // 3. Create API URL
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        // 4. Send API Request
        const response = await fetch(url);

        // 5. Check if response is successful
        if (!response.ok) {
            throw new Error("City not found");
        }

        // 6. Convert response to JSON
        const data = await response.json();

        // 7. Display weather data on screen
        displayWeather(data);

        // 8. Save successfully searched city to localStorage
        localStorage.setItem("lastSearchedCity", data.name);

    } catch (error) {
        // Log error for debugging while keeping API key hidden from UI
        console.error("Weather fetch error:", error.message);

        // Show user-friendly error message
        showError("Please enter correct city name");

        // Keep or revert view state
        weatherContainer.classList.add("hidden");
        welcomeMessage.classList.remove("hidden");

    } finally {
        // 9. Reset Search Button State
        searchBtn.disabled = false;
        searchBtn.classList.remove("loading");
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> <span>Search</span>';
    }
}


/**
 * Update DOM elements with weather data
 * @param {Object} data - The weather response object
 */
function displayWeather(data) {
    // City name with first letter capitalized
    cityName.textContent = capitalizeFirstLetter(data.name);

    // Country code
    countryName.textContent = data.sys.country;

    // Weather condition description
    const conditionDescription = data.weather[0].description;
    weatherCondition.textContent = capitalizeFirstLetter(conditionDescription);

    // Temperatures
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = Math.round(data.main.feels_like);
    minMax.textContent = `${Math.round(data.main.temp_min)}° / ${Math.round(data.main.temp_max)}°C`;

    // Atmospheric details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    // Visibility in km (API returns meters)
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    visibility.textContent = `${visibilityKm} km`;

    // Cloudiness percentage
    cloudiness.textContent = `${data.clouds.all}%`;

    // Weather icon from OpenWeather
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = conditionDescription;

    // Transition view from welcome message to weather display
    welcomeMessage.classList.add("hidden");
    weatherContainer.classList.remove("hidden");
}


/**
 * Capitalize the first letter of each word in a string
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
    if (!text) return "";

    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/**
 * Show error message in the UI
 * @param {string} message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("visible");
}


/**
 * Clear error message from the UI
 */
function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.remove("visible");
}