import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  render() {
    const { lat, lng } = this.props;
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
         lat,
         lng
        }}
      >
        <Marker
          title={'dirección de origen'}
          name={'SOMA'}
          position={{ lat, lng }} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDpHadZTD-Z9ln2ztCJGvAt7UI2PFG1N98'
})(MapContainer);