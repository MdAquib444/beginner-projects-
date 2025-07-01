navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const w = data.current_weather;
      const html = `
        🌡️ Temp: ${w.temperature}°C<br>
        💨 Wind: ${w.windspeed} km/h<br>
        🕒 Time: ${w.time}
      `;
      document.getElementById("weather").innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("weather").textContent = "❌ Weather fetch failed.";
    });
}

function error() {
  document.getElementById("weather").textContent = "❌ Please allow location access.";
}