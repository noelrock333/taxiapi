import React from 'react';
import DriverInfo from './components/DriverInfo';
import VehicleInfo from './components/VehicleInfo';
import TripInfo from './components/TripInfo';

import './styles/main.scss';

const App = () => {
  return (<div>
    <DriverInfo />
    <VehicleInfo />
    <TripInfo />
  </div>);
}

export default App;
