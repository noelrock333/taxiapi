import React from 'react';
import DriverInfo from './components/DriverInfo';
import VehicleInfo from './components/VehicleInfo';
import TripInfo from './components/TripInfo';
import Map from './components/Map';

import './styles/main.scss';

const App = () => {
  return (<div>
    <aside>
      <DriverInfo />
      <VehicleInfo />
      <TripInfo />
    </aside>
    <Map />
  </div>);
}

export default App;
