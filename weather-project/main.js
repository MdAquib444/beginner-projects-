const lat = 28.61; // Delhi
const lon = 77.23;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
  .then(res => res.json())
  .then(data => {
    const weather = data.current_weather;
    const text = `🌡️ Temp: ${weather.temperature}°C  
💨 Wind: ${weather.windspeed} km/h  
🕐 Time: ${weather.time}`;
    document.getElementById('weather').textContent = text;
  })
  .catch(err => {
    document.getElementById('weather').textContent = "Error fetching weather.";
    console.error(err);
  });