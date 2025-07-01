function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  document.getElementById('time').textContent = `Time: ${timeStr}`;
}

function setWeatherBackground(code) {
  let bg = '';

  if (code >= 0 && code <= 3) {
    bg = 'https://source.unsplash.com/1600x900/?sunny';
  } else if (code >= 45 && code <= 48) {
    bg = 'https://source.unsplash.com/1600x900/?fog';
  } else if (code >= 51 && code <= 67) {
    bg = 'https://source.unsplash.com/1600x900/?drizzle';
  } else if (code >= 71 && code <= 77) {
    bg = 'https://source.unsplash.com/1600x900/?snow';
  } else if (code >= 80 && code <= 82) {
    bg = 'https://source.unsplash.com/1600x900/?rain';
  } else if (code >= 95) {
    bg = 'https://source.unsplash.com/1600x900/?storm';
  } else {
    bg = 'https://source.unsplash.com/1600x900/?weather';
  }

  document.body.style.backgroundImage = `url('${bg}')`;
}

function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const weather = data.current_weather;
      const code = weather.weathercode;
      document.getElementById('temperature').textContent = `Temperature: ${weather.temperature} °C`;
      document.getElementById('condition').textContent = `Weather Code: ${code}`;
      document.getElementById('wind').textContent = `Wind: ${weather.windspeed} km/h`;

      setWeatherBackground(code);
    })
    .catch(() => {
      document.getElementById('location').textContent = "❌ Failed to fetch weather.";
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      document.getElementById('location').textContent = `Your Location`;
      fetchWeather(lat, lon);
    }, () => {
      document.getElementById('location').textContent = "❌ Location denied.";
    });
  } else {
    document.getElementById('location').textContent = "❌ Geolocation not supported.";
  }
}

getLocation();
updateTime();
setInterval(updateTime, 1000);