import React from "react";
// import WeatherIcons from "./components/weatherIcons.component";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.min.css";
import Weather from "./app_component/weather.component";
import Form from "./app_component/form.component";
import Forecast from "./app_component/forecast.component";

const API_key = "1952cc01bff81ba8bf8650114746df46";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      current_Temp: undefined,
      max_Temp: undefined,
      min_Temp: undefined,
      description: "",
      icon: undefined,
      error: false,
      hourlyForecast: [],
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog",
    };
  }

  get_WeatherIcon(icons, rangeID) {
    switch (true) {
      case rangeID >= 200 && rangeID <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeID >= 701 && rangeID <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;
      case rangeID >= 800 && rangeID <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
    }
  }

  getWeather = async (e) => {
    e.preventDefault();

    try {
      const city = e.target.elements.city.value;
      const country = e.target.elements.country.value;
      const api_call = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}&units=metric`
      );
      const response = await api_call.json();

      const lat = response.coord.lat;
      const lon = response.coord.lon;
      const api_call_forecast = await fetch(
        `https://api.openweathermap.org/data/2.5//onecall?lat=${lat}&lon=${lon}&APPID=${API_key}&units=metric`
      );
      const resForecast = await api_call_forecast.json();
      console.log(resForecast);

      this.setState({
        city: `${response.name}, ${response.sys.country}`,

        current_Temp: Math.floor(response.main.temp),
        max_Temp: Math.floor(response.main.temp_max),
        min_Temp: Math.floor(response.main.temp_min),
        description: response.weather[0].description,
        error: false,
        hourlyForecast: resForecast.hourly,
      });
      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
      }

      this.setState({
        error: true,
      });
    }
  };

  render() {
    const hourlyForecast = this.state.hourlyForecast;
    return (
      <div className="App">
        <Form loadWeather={this.getWeather} error={this.state.error} />
        <Weather
          city={this.state.city}
          country={this.state.country}
          current_Temp={this.state.current_Temp}
          max_Temp={this.state.max_Temp}
          min_Temp={this.state.min_Temp}
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
        {hourlyForecast.length > 0 && <Forecast forecast={hourlyForecast} />}
      </div>
    );
  }
}

export default App;
