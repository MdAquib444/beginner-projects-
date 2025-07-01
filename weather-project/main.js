navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const w = data.current_weather;
      const text = `🌡️ Temp: ${w.temperature}°C  
💨 Wind: ${w.windspeed} km/h  
🕐 Time: ${w.time}`;
      document.getElementById('weather').textContent = text;
    })
    .catch(err => {
      document.getElementById('weather').textContent = "❌ Error fetching weather.";
      console.error(err);
    });
}

function error(err) {
  document.getElementById('weather').textContent = "❌ Please allow location access.";
  console.error(err);
}