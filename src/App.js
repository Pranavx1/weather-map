import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import './App.css';

function App() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [weather, setWeather] = useState(null);
  const [gribData, setGribData] = useState(null);

  const customIcon = new Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconSize: [38, 38]
  });

  const fetchGribData = async () => {
    try {
      const response = await fetch('http://localhost:3001/fetch-grib');
      if (!response.ok) {
        throw new Error('Failed to fetch GRIB data');
      }
      const jsonData = await response.json();
      setGribData(jsonData);
    } catch (error) {
      alert(error.message);
    }
  };

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
        <input
          type="number"
          id="latitude"
          step="0.01"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="number"
          id="longitude"
          step="0.01"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>
        <button onClick={fetchGribData}>Fetch GRIB Data</button>
      </div>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <TileLayer
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        />
        {weather && (
          <Marker position={[lat, lon]} icon={customIcon}>
            <Popup>
              <h2>{weather.name}</h2>
              <p>Temperature: {weather.main.temp} °F</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Weather: {weather.weather[0].description}</p>
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </Popup>
          </Marker>
        )}
        {gribData && (
          <Marker position={[lat, lon]} icon={customIcon}>
            <Popup>
              <h2>GRIB Data</h2>
              <pre>{JSON.stringify(gribData, null, 2)}</pre>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default App;
