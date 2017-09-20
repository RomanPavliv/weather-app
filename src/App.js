import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Loader } from 'semantic-ui-react'
import './App.css';

import {  
  getCity,
  getWeatherCurrentUserPosition,
} from './redux';

class App extends Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getWeatherCurrentUserPosition(this, true);
  }

  render() {
    return (
      <div className="App">
        <h1>Get the weather!</h1>
         <form>
            <Input type="text" id="city-enter" placeholder="enter city" name="city"
                   onChange={(event) => this.props.getCity(event)} />

            <Button type="button" primary onClick={() => {
                    this.props.getWeatherCurrentUserPosition(this)}}>Search</Button>
        </form>
        <section id="weather-text" name="weather">
          The weather in: {this.props.geod.weather ? this.props.geod.weather : <Loader active/>}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({  
  geod: state.geod
});

const mapDispatchToProps = { 
    getCity,
    getWeatherCurrentUserPosition,
};

const AppContainer = connect(  
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
