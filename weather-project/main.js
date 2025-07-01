async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,wind_speed_10m,relative_humidity_2m&timezone=auto`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const weather = data.current;

    const conditionMap = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime Fog",
      51: "Light Drizzle",
      53: "Drizzle",
      55: "Dense Drizzle",
      61: "Light Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      80: "Rain Showers",
      95: "Thunderstorm"
    };

    document.querySelector('.location').textContent = `Your Location`;
    document.querySelector('.temperature').textContent = `${weather.temperature_2m}°C`;
    document.querySelector('.condition').textContent = conditionMap[weather.weathercode] || "Unknown";
    document.querySelector('.realfeel').textContent = `Humidity: ${weather.relative_humidity_2m}%`;

    const cardData = [
      `${weather.relative_humidity_2m}%`,
      `--`,
      `${weather.wind_speed_10m} km/h`,
      `--`,
      `--`,
      `--`
    ];

    document.querySelectorAll('.card h3').forEach((el, i) => {
      el.textContent = cardData[i];
    });

  } catch (err) {
    console.error("Weather fetch failed:", err);
    alert("Could not fetch weather data.");
  }
}

function getLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getWeather(lat, lon);
      },
      (err) => {
        console.error("Location error:", err.message);
        alert("Location access denied.");
      }
    );
  } else {
    alert("Geolocation not supported in this browser.");
  }

  const now = new Date();
  document.querySelector('.date').textContent = now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });
}

getLocationAndWeather();