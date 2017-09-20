import {  
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';

import axios from 'axios';
import thunk from 'redux-thunk';

const initialState = {city: '', weather: ''};

export const getWeatherCurrentUserPosition = (self, currentPosition) => {
  return dispatch => {
    sessionStorage.removeItem('weather');
    function getWeather(self) {
      let url = `https://api.openweathermap.org/data/2.5/weather/?q=${self.props.geod.city}
                 &units=metric&APPID=1feb720412a26a7828127770f514bf58`;
      
      axios.get(url)
      .then(res => {
        let weather = self.props.geod.city + ", " + res.data.sys.country + " " + res.data.main.temp +  " " +
                      String.fromCharCode(176) + "C, " + res.data.weather[0].description + ", wind: " + 
                      res.data.wind.speed + " m/s";

        sessionStorage.setItem('weather', weather);
  
        dispatch({type: 'GET_WEATHER', payload: weather});
      })
      .catch(err => {
        console.log(err);
      });     
    }

    if (!currentPosition) {
      getWeather(self);
    }
    else {

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {

          let googleApiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},
                              ${position.coords.longitude}&language=en&key=AIzaSyAlI3lat_5W-O4wWZ0p1peRh6vFCYeD89I`;
          
          axios.get(googleApiURL)
          .then(res => {

            dispatch({type: 'GET_CITY', payload: res.data.results[0].address_components[3].long_name});
          
            let url = `https://api.openweathermap.org/data/2.5/weather/?q=${self.props.geod.city} 
                      &units=metric&APPID=1feb720412a26a7828127770f514bf58`;

            getWeather(self);

          })
          .catch(err => {
            console.log(err);
          });
        });
      } 
      else {
        dispatch({type: 'GET_WEATHER', payload: 'geolocation is not allowed'});
      }
    }
  }
}

export const getCity = name => {
  return dispatch => {
    dispatch({type: 'GET_CITY', payload: name.target.value});
  }
}

export const geod = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_WEATHER':
      return  Object.assign({}, {weather: action.payload});
    case 'GET_CITY':
      return Object.assign({}, {city: action.payload});
    default:
      return state;
  }
};

export const reducers = combineReducers({  
  geod,
});

export function configureStore(initialState = initialState) {  
  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunk)
  )
  return store;
};
  
export const store = configureStore();  