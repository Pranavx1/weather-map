import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import  { Icon } from 'leaflet';
import './App.css';
function App() {
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [weather, setWeather] = useState(null);
  const customicon = new Icon({iconUrl:require("leaflet/dist/images/marker-icon.png"),iconSize:[38,38]})
  const getWeather = async () => {
    if (!lat || !lon) {
      alert('Please enter valid latitude and longitude');
      return;
    }

    const apiKey = 'e22292ba4b23e6474b077292d13c380a';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      alert(error.message);
    }

  };
  
  return (
    <div className="App">
      <div className="input-form">
        <label htmlFor="latitude">Latitude:</label>
        <input type="number" id="latitude" step="0.01" value={lat} onChange={(e) => setLat(e.target.value)} />
        <label htmlFor="longitude">Longitude:</label>
        <input type="number" id="longitude" step="0.01" value={lon} onChange={(e) => setLon(e.target.value)} />
        <button onClick={getWeather}>Get Weather</button>
      </div>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {weather && (
          <Marker position={[lat, lon]}  icon={customicon}>
          <Popup >
            <h2>{weather.name}</h2>
            <p>Temperature: {weather.main.temp} °F</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Weather: {weather.weather[0].description}</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
          </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
export default App;
