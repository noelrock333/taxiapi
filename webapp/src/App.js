import React from 'react';
import DriverInfo from './components/DriverInfo';
import VehicleInfo from './components/VehicleInfo';
import TripInfo from './components/TripInfo';
import Map from './components/Map';

import './styles/main.scss';

class App extends React.Component {
  componentDidMount() {
    const guid = window.location.pathname.split('/').pop();
    fetch(`/api/trips/traking/${guid}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
      });
  }

  render() {
    return (<div>
      <aside>
        <DriverInfo />
        <VehicleInfo />
        <TripInfo />
      </aside>
      <Map />
    </div>);
  }
}

export default App;
