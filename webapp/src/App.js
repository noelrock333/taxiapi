import React from 'react';
import DriverInfo from './components/DriverInfo';
import VehicleInfo from './components/VehicleInfo';
import TripInfo from './components/TripInfo';
import Map from './components/Map';
import Api from './utils/api';

import './styles/main.scss';

class App extends React.Component {
  state = {
    trip: null,
    driver: null,
    vehicle: null
  }
  componentDidMount() {
    const guid = window.location.pathname.split('/').pop();
    console.log(process.env.TRACK_APP_BASE_URL)
    Api.get(`/trips/traking/${guid}`)
      .then((response) => {
        let trip = response.data;
        let { driver, vehicle } = trip;
        this.setState({
          trip,
          driver,
          vehicle,
        });
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
    const { driver, vehicle, trip } = this.state;
    return (<div>
      <aside>
        {driver && <DriverInfo driver={driver} />}
        {vehicle && <VehicleInfo vehicle={vehicle} />}
        {trip && <TripInfo trip={trip} />}
      </aside>
      {trip && <Map lat={trip.lat_origin} lng={trip.lng_origin} />}
    </div>);
  }
}

export default App;
