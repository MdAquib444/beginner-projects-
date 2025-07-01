function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById('time').textContent = `Time: ${timeStr}`;
}

function fetchWeather(lat, lon) {
  const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      const weather = data.current_weather;
      document.getElementById('temperature').textContent = `Temperature: ${weather.temperature} °C`;
      document.getElementById('description').textContent = `Condition Code: ${weather.weathercode}`;
      document.getElementById('wind').textContent = `Wind: ${weather.windspeed} km/h`;
    })
    .catch(() => {
      document.getElementById('location').textContent = "Failed to load weather data.";
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      document.getElementById('location').textContent = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
      fetchWeather(lat, lon);
    }, () => {
      document.getElementById('location').textContent = "Permission denied for location.";
    });
  } else {
    document.getElementById('location').textContent = "Geolocation not supported.";
  }
}

getLocation();
updateTime();
setInterval(updateTime, 1000);