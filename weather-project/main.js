navigator.geolocation.getCurrentPosition(success, error);

function success(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      const w = data.current_weather;
      const html = `
        🌡️ <strong>Temp:</strong> ${w.temperature}°C<br>
        💨 <strong>Wind:</strong> ${w.windspeed} km/h<br>
        🕒 <strong>Time:</strong> ${w.time.replace("T", " ")}
      `;
      document.getElementById("weather").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("weather").textContent = "❌ Weather data not available.";
    });
}

function error() {
  document.getElementById("weather").textContent = "❌ Location permission denied.";
}