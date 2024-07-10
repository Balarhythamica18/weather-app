import { useEffect, useState } from 'react';
import "./App.css";

/* Images */
import SearchIcon from "./assets/search.png";
import ClearIcon from "./assets/download.jfif";
import CloudIcon from "./assets/cloud.png";
import DrizzleIcon from "./assets/drizzle.png";
import RainIcon from "./assets/rain.png";
import WindIcon from "./assets/wind.png";
import SnowIcon from "./assets/SnowCloud.png";
import HumidityIcon from "./assets/humidity.png";
import ThunderIcon from "./assets/thunder.png";
import Mist from "./assets/mist.png";
import ShowRain from "./assets/ShowRain.jfif"

const WeatherApp = ({ icon, temp, city, country, lat, lon, humidity, wind }) => {
  return (
    <>
      <div className="image"><img src={icon} alt="weather icon" /></div>
      <div className="temp">{temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span className='value'> {lat}</span>
        </div>
        <div>
          <span className='lon'>longitude</span>
          <span className='value'> {lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={HumidityIcon} className='icon' alt="humidity icon" />
          <div className="data">
            <div className="humidity-percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={WindIcon} className='icon' alt="wind icon" />
          <div className="data">
            <div className="wind-percentage">{wind}km/hr</div>
            <div className="text">Wind</div>
          </div>
        </div>
      </div>
    </>
  );
};

const App = () => {
  let api_key = "2bf609ea580099d448f6a6b8f0d6d817";
  const [text, setText] = useState("Kumbakonam");

  const [icon, setIcon] = useState(SnowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("kumbakonam");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const[error,setError]=useState(null)

  const weatherIconMap = {
    "01d": ClearIcon,
    "01n": ClearIcon,
    "02d": CloudIcon,
    "02n": CloudIcon,
    "03d": DrizzleIcon,
    "03n": DrizzleIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": ShowRain,
    "09n": ShowRain,
    "10d": RainIcon,
    "10n": RainIcon,
    "13d": SnowIcon,
    "13n": SnowIcon,
    "11d": ThunderIcon,
    "11n": ThunderIcon,
    "50d": Mist,
    "50n": Mist,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        console.error("city not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || ClearIcon);
      setCityNotFound(false);

    } catch (error) {
      console.error("An Error Occurred:", error.message);
      setError("Problem in fetching data..")
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
 useEffect(function () {
  search();
 },[])

  return (
    <div className='container'>
      <h1 className='Heading'>Weather App</h1>
      <div className="Input-container">
        <input type="text" placeholder='search city' onChange={handleCity} value={text} className='city-Input' onKeyDown={handleKeyDown} />
        <div className="searchIcon" onClick={() => search()}>
          <img src={SearchIcon} alt="search" />
        </div>
      </div>
      {!loading && !cityNotFound && <WeatherApp icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind} />}
      {loading && <div className="loading-message">
      Loading...
      </div>}
      {error && <div className="error-message">{error}</div>}
     {cityNotFound && <div className="city-not-found">Oops!! City Not Found</div>}
    </div>
  
  );
};

export default App;