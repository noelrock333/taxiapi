import React from 'react';
import DriverInfo from './components/DriverInfo';
import VehicleInfo from './components/VehicleInfo';
import TripInfo from './components/TripInfo';
import Map from './components/Map';
import Preview from './components/Preview';
import Api from './utils/api';

import './styles/main.scss';

class App extends React.Component {
  state = {
    trip: null,
    driver: null,
    vehicle: null,
    preview: true
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
  }

  togglePreview = () => {
    this.setState({ preview: !this.state.preview });
  }

  render() {
    const { driver, vehicle, trip, preview } = this.state;
    return (<div>
      <aside>
        {!preview && <div className="aside-cards">
          {driver && <DriverInfo driver={driver} />}
          {vehicle && <VehicleInfo vehicle={vehicle} />}
          {trip && <TripInfo trip={trip} />}
          <button onClick={this.togglePreview}>Ocultar</button>
        </div>}
        {preview && driver && vehicle && <Preview driver={driver} vehicle={vehicle} togglePreview={this.togglePreview} />}
      </aside>
      {trip && <Map lat={trip.lat_origin} lng={trip.lng_origin} />}
    </div>);
  }
}

export default App;
