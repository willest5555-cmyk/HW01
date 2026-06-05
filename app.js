document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) {
        lucide.createIcons();
    }

    initClock();
    initCalendar();
    initWeather();
});

function initClock() {
    const timeDisplay = document.getElementById("time-display");
    const secondsDisplay = document.getElementById("seconds-display");
    const ampmDisplay = document.getElementById("ampm-display");
    const dateText = document.getElementById("date-text");
    const dayOfWeekText = document.getElementById("day-of-week-text");
    const weekdaysZh = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;

        timeDisplay.textContent = `${String(hours).padStart(2, "0")}:${minutes}`;
        secondsDisplay.textContent = seconds;
        ampmDisplay.textContent = ampm;
        dateText.textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日`;
        dayOfWeekText.textContent = weekdaysZh[now.getDay()];
    }

    updateTime();
    setInterval(updateTime, 1000);
}

function initCalendar() {
    const calendarMonthYear = document.getElementById("calendar-month-year");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const calendarGrid = document.getElementById("calendar-grid-container");
    const weekdaysShort = ["日", "一", "二", "三", "四", "五", "六"];
    const monthsZh = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const currentDate = new Date();

    function renderCalendar(date) {
        calendarGrid.innerHTML = "";

        weekdaysShort.forEach((day) => {
            const header = document.createElement("div");
            header.className = "weekday";
            header.textContent = day;
            calendarGrid.appendChild(header);
        });

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
        const totalDaysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();

        calendarMonthYear.textContent = `${year} 年 ${monthsZh[month]}`;

        for (let i = firstDayOfMonth - 1; i >= 0; i -= 1) {
            addDay(totalDaysInPrevMonth - i, "sibling-month");
        }

        for (let i = 1; i <= totalDaysInMonth; i += 1) {
            const classes = i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                ? "today"
                : "";
            addDay(i, classes, true);
        }

        const renderedCells = firstDayOfMonth + totalDaysInMonth;
        for (let i = 1; i <= 42 - renderedCells; i += 1) {
            addDay(i, "sibling-month");
        }
    }

    function addDay(label, className = "", selectable = false) {
        const day = document.createElement("div");
        day.className = ["day", className].filter(Boolean).join(" ");
        day.textContent = label;

        if (selectable) {
            day.addEventListener("click", () => {
                document.querySelectorAll(".day.selected").forEach((element) => element.classList.remove("selected"));
                day.classList.add("selected");
            });
        }

        calendarGrid.appendChild(day);
    }

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
}

function initWeather() {
    const weatherBody = document.getElementById("weather-body-container");
    const weatherDetails = document.getElementById("weather-details-container");
    const humidityValue = document.getElementById("humidity-value");
    const windValue = document.getElementById("wind-value");
    const popValue = document.getElementById("pop-value");
    const citySearch = document.getElementById("city-search");

    const defaultCoords = {
        name: "台中市",
        lat: 24.1477,
        lon: 120.6736
    };

    const weatherCodes = {
        0: ["晴朗無雲", "sunny"],
        1: ["晴時多雲", "cloudy-sun"],
        2: ["多雲", "cloudy"],
        3: ["陰天", "cloudy"],
        45: ["有霧", "fog"],
        48: ["濃霧", "fog"],
        51: ["毛毛細雨", "rainy"],
        53: ["毛毛雨", "rainy"],
        55: ["大毛毛雨", "rainy"],
        61: ["陣雨", "rainy"],
        63: ["中雨", "rainy"],
        65: ["大雨", "rainy"],
        71: ["小雪", "snowy"],
        73: ["中雪", "snowy"],
        75: ["大雪", "snowy"],
        80: ["陣雨", "rainy"],
        81: ["中等陣雨", "rainy"],
        82: ["大雨暴雨", "rainy"],
        95: ["雷陣雨", "thunder"],
        96: ["雷雨伴有冰雹", "thunder"],
        99: ["暴雷雨伴有冰雹", "thunder"]
    };

    async function fetchWeather(lat, lon, cityName) {
        try {
            showLoading(`正在取得 ${cityName} 的天氣狀況...`);

            const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
            weatherUrl.search = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                current_weather: "true",
                hourly: "relativehumidity_2m,precipitation_probability",
                timezone: "auto"
            });

            const response = await fetch(weatherUrl);
            if (!response.ok) {
                throw new Error("Weather fetch failed");
            }

            const data = await response.json();
            const current = data.current_weather;
            const [description, iconType] = weatherCodes[current.weathercode] || ["未知天氣", "sunny"];
            const hourIndex = findCurrentHourIndex(data.hourly?.time, current.time);
            const humidity = data.hourly?.relativehumidity_2m?.[hourIndex] ?? "--";
            const precipitationProb = data.hourly?.precipitation_probability?.[hourIndex] ?? "--";

            weatherBody.innerHTML = `
                <div class="weather-info">
                    <span class="weather-city">${cityName}</span>
                    <div class="weather-temp-container">
                        <span class="weather-temp">${Math.round(current.temperature)}</span>
                        <span class="weather-unit">°C</span>
                    </div>
                    <span class="weather-desc">${description}</span>
                </div>
                <div class="weather-graphic">
                    ${getWeatherSVG(iconType)}
                </div>
            `;

            humidityValue.textContent = `${humidity}%`;
            windValue.textContent = `${Math.round(current.windspeed)} km/h`;
            popValue.textContent = `${precipitationProb}%`;
            weatherDetails.style.display = "grid";
        } catch (error) {
            weatherDetails.style.display = "none";
            weatherBody.innerHTML = `
                <div class="weather-error">
                    <i data-lucide="alert-triangle"></i>
                    <p>載入天氣失敗，請檢查網路連線或稍後再試。</p>
                </div>
            `;
        } finally {
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    }

    function showLoading(message) {
        weatherDetails.style.display = "none";
        weatherBody.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <span>${message}</span>
            </div>
        `;
    }

    function findCurrentHourIndex(times = [], currentWeatherTime = "") {
        const currentHour = currentWeatherTime ? currentWeatherTime.slice(0, 13) : new Date().toISOString().slice(0, 13);
        const index = times.findIndex((time) => time.startsWith(currentHour));
        return index === -1 ? 0 : index;
    }

    async function searchCity(cityName) {
        if (!cityName.trim()) {
            return;
        }

        try {
            const geocodeUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
            geocodeUrl.search = new URLSearchParams({
                name: cityName,
                count: "1",
                language: "zh",
                format: "json"
            });

            const response = await fetch(geocodeUrl);
            if (!response.ok) {
                throw new Error("Geocoding query failed");
            }

            const data = await response.json();
            if (!data.results?.length) {
                shakeSearchBox();
                return;
            }

            const result = data.results[0];
            const displayName = result.name + (result.admin1 ? `, ${result.admin1}` : "");
            citySearch.value = "";
            fetchWeather(result.latitude, result.longitude, displayName);
        } catch (error) {
            shakeSearchBox();
        }
    }

    function shakeSearchBox() {
        const searchBox = document.querySelector(".search-container");
        searchBox.style.animation = "shake 0.4s ease";
        setTimeout(() => {
            searchBox.style.animation = "";
        }, 400);
    }

    citySearch.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchCity(citySearch.value);
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => fetchWeather(position.coords.latitude, position.coords.longitude, "目前位置"),
            () => fetchWeather(defaultCoords.lat, defaultCoords.lon, defaultCoords.name),
            { timeout: 8000 }
        );
    } else {
        fetchWeather(defaultCoords.lat, defaultCoords.lon, defaultCoords.name);
    }
}

function getWeatherSVG(iconType) {
    const cloud = '<path class="cloud" d="M44.7,33.3c0-6.1-5-11-11-11c-4.8,0-8.9,3.1-10.4,7.4c-0.7-0.3-1.4-0.4-2.2-0.4c-3.7,0-6.7,3-6.7,6.7s3,6.7,6.7,6.7c0.2,0,0.5,0,0.7-0.1c1.5,3.4,4.9,5.8,8.9,5.8c6.1,0,11-5,11-11h3z" />';

    if (iconType === "cloudy-sun") {
        return `<svg class="weather-icon-svg" viewBox="0 0 64 64"><circle cx="24" cy="24" r="10" class="sun" />${cloud}</svg>`;
    }

    if (iconType === "cloudy") {
        return `<svg class="weather-icon-svg" viewBox="0 0 64 64"><path class="cloud cloud-dark" d="M18,35c0-4.4,3.6-8,8-8c0.3,0,0.6,0,0.9,0.1c1.8-4.1,5.9-7,10.7-7c5.8,0,10.6,4.2,11.3,9.7c0.8-0.4,1.8-0.7,2.8-0.7c3.9,0,7,3.1,7,7s-3.1,7-7,7H26C21.6,43,18,39.4,18,35z" />${cloud}</svg>`;
    }

    if (iconType === "fog") {
        return `<svg class="weather-icon-svg" viewBox="0 0 64 64">${cloud}<line x1="16" y1="48" x2="48" y2="48" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" /><line x1="20" y1="54" x2="44" y2="54" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" /></svg>`;
    }

    if (iconType === "rainy") {
        return `<svg class="weather-icon-svg" viewBox="0 0 64 64">${cloud}<line x1="24" y1="48" x2="20" y2="56" stroke-width="3" stroke-linecap="round" class="rain" /><line x1="32" y1="48" x2="28" y2="56" stroke-width="3" stroke-linecap="round" class="rain" style="animation-delay:0.3s" /><line x1="40" y1="48" x2="36" y2="56" stroke-width="3" stroke-linecap="round" class="rain" style="animation-delay:0.6s" /></svg>`;
    }

    if (iconType === "snowy") {
        return `<svg class="weather-icon-svg" viewBox="0 0 64 64">${cloud}<circle cx="23" cy="49" r="2.5" class="snow-flake" /><circle cx="32" cy="52" r="2.5" class="snow-flake" style="animation-delay:0.8s" /><circle cx="41" cy="48" r="2.5" class="snow-flake" style="animation-delay:1.6s" /></svg>`;
    }

    if (iconType === "thunder") {
        return `<svg class="weather-icon-svg" viewBox="0 0 64 64">${cloud}<polygon points="32,43 24,53 31,53 28,60 38,50 31,50" fill="#f59e0b" style="animation:bounce 0.8s infinite alternate" /></svg>`;
    }

    return `<svg class="weather-icon-svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="12" class="sun" /><g stroke="#f59e0b" stroke-width="3" stroke-linecap="round"><line x1="32" y1="10" x2="32" y2="15" /><line x1="32" y1="49" x2="32" y2="54" /><line x1="10" y1="32" x2="15" y2="32" /><line x1="49" y1="32" x2="54" y2="32" /><line x1="16.4" y1="16.4" x2="19.9" y2="19.9" /><line x1="44.1" y1="44.1" x2="47.6" y2="47.6" /><line x1="16.4" y1="47.6" x2="19.9" y2="44.1" /><line x1="44.1" y1="19.9" x2="47.6" y2="16.4" /></g></svg>`;
}
