import React from 'react';
import DriverInfo from './components/DriverInfo';
import VehicleInfo from './components/VehicleInfo';
import TripInfo from './components/TripInfo';
import Map from './components/Map';

import './styles/main.scss';

class App extends React.Component {
  componentDidMount() {
    const guid = window.location.pathname.split('/').pop();
    console.log(process.env.TRACK_APP_BASE_URL)
    fetch(`/api/trips/traking/${guid}`)
      .then(function(response) {
        console.log(response);
        if (response) {
          console.log(response.json());
        } else {
          console.error('Ha ocurrido un error')
        }
      })
      .catch(error => {
        console.log(error);
      });
    // firebase
    //   .database()
    //   .ref(`server/tracking/${guid}`)
    //   .on('value', snapshot => {
    //     const trips = snapshot.val()
    //     console.log(trips);
    //   })
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
