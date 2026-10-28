// ==========================================
// API CONFIGURATION
// ==========================================

const API_KEY = "YOUR_OPENWEATHER_API_KEY";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const LAST_CITY_KEY = "lastSearchedCity";
const INVALID_CITY_MESSAGE = "Please enter correct city name";


// ==========================================
// DOM ELEMENTS
// ==========================================

const searchForm = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const searchBtnIcon = document.querySelector("#searchBtnIcon");
const searchBtnText = document.querySelector("#searchBtnText");
const errorMessage = document.querySelector("#errorMessage");
const weatherContainer = document.querySelector("#weatherContainer");
const welcomeMessage = document.querySelector("#welcomeMessage");

const weatherElements = {
    city: document.querySelector("#cityName"),
    country: document.querySelector("#countryName"),
    icon: document.querySelector("#weatherIcon"),
    condition: document.querySelector("#weatherCondition"),
    temperature: document.querySelector("#temperature"),
    feelsLike: document.querySelector("#feelsLike"),
    humidity: document.querySelector("#humidity"),
    windSpeed: document.querySelector("#windSpeed"),
    pressure: document.querySelector("#pressure"),
    visibility: document.querySelector("#visibility"),
    cloudiness: document.querySelector("#cloudiness"),
    minMax: document.querySelector("#minMax")
};

const hintChips = document.querySelectorAll(".hint-chip");


// ==========================================
// EVENT LISTENERS
// ==========================================

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeather(cityInput.value);
});

cityInput.addEventListener("input", () => {
    if (errorMessage.textContent) {
        clearError();
    }
});

hintChips.forEach((chip) => {
    chip.addEventListener("click", () => {
        const selectedCity = chip.dataset.city;
        if (selectedCity) {
            cityInput.value = selectedCity;
            getWeather(selectedCity);
        }
    });
});

loadLastSearchedCity();


// ==========================================
// WEATHER API
// ==========================================

async function getWeather(cityName) {
    const city = cityName.trim();

    if (!city) {
        showError(INVALID_CITY_MESSAGE);
        cityInput.focus();
        return;
    }

    if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
        showError("Add your OpenWeather API key in the API configuration section of script.js.");
        return;
    }

    clearError();
    setLoading(true);

    try {
        const requestUrl = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(requestUrl);

        if (response.status === 404 || response.status === 400) {
            throw new Error(INVALID_CITY_MESSAGE);
        }
        if (response.status === 401) {
            throw new Error("OpenWeather rejected the API key. Check the API configuration in script.js.");
        }
        if (!response.ok) {
            throw new Error(`Weather service returned an error (HTTP ${response.status}). Please try again.`);
        }

        const data = await response.json();
        displayWeather(data);
        saveLastSearchedCity(data.name);
    } catch (error) {
        console.error("Weather request failed:", error);

        if (error instanceof TypeError) {
            showError("Unable to connect to the weather service. Check your internet connection and try again.");
        } else {
            showError(error.message || "Something went wrong while loading the weather.");
        }
    } finally {
        setLoading(false);
    }
}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(data) {
    const { name, sys, weather, main, wind, visibility: visibilityMeters, clouds } = data;
    const currentCondition = weather?.[0];

    if (!name || !main || !currentCondition) {
        throw new Error("The weather service returned incomplete data. Please try again.");
    }

    const { description, icon } = currentCondition;
    const { temp, feels_like: feelsLike, temp_min: minTemp, temp_max: maxTemp, humidity, pressure } = main;

    weatherElements.city.textContent = name;
    weatherElements.country.textContent = sys?.country ?? "";
    weatherElements.condition.textContent = capitalizeWords(description ?? "Current conditions");
    weatherElements.temperature.textContent = Math.round(Number(temp));
    weatherElements.feelsLike.textContent = Math.round(Number(feelsLike));
    weatherElements.humidity.textContent = `${humidity ?? "--"}%`;
    weatherElements.windSpeed.textContent = `${wind?.speed ?? "--"} m/s`;
    weatherElements.pressure.textContent = `${pressure ?? "--"} hPa`;
    weatherElements.visibility.textContent = visibilityMeters == null
        ? "N/A"
        : `${(Number(visibilityMeters) / 1000).toFixed(1)} km`;
    weatherElements.cloudiness.textContent = `${clouds?.all ?? 0}%`;
    weatherElements.minMax.textContent = `${Math.round(Number(minTemp))}° / ${Math.round(Number(maxTemp))}°C`;

    weatherElements.icon.src = icon
        ? `https://openweathermap.org/img/wn/${icon}@2x.png`
        : "";
    weatherElements.icon.alt = description ?? "Current weather";

    welcomeMessage.classList.add("hidden");
    weatherContainer.classList.remove("hidden");
}


// ==========================================
// VALIDATION AND UI STATE
// ==========================================

function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    searchBtn.classList.toggle("loading", isLoading);
    searchBtnIcon.className = isLoading
        ? "fa-solid fa-spinner fa-spin"
        : "fa-solid fa-magnifying-glass";
    searchBtnText.textContent = isLoading ? "Searching..." : "Search";
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("visible");
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.remove("visible");
}


// ==========================================
// LOCAL STORAGE
// ==========================================

function saveLastSearchedCity(city) {
    try {
        localStorage.setItem(LAST_CITY_KEY, city);
    } catch (error) {
        console.warn("Could not save the last searched city:", error);
    }
}

function loadLastSearchedCity() {
    try {
        const savedCity = localStorage.getItem(LAST_CITY_KEY);
        if (savedCity) {
            cityInput.value = savedCity;
            getWeather(savedCity);
        }
    } catch (error) {
        console.warn("Could not read the last searched city:", error);
    }
}


// ==========================================
// HELPERS
// ==========================================

function capitalizeWords(text) {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
