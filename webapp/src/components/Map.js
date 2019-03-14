import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

export class MapContainer extends Component {
  state = {
    bounds: null,
    points: null
  } 
  componentDidMount() {
    const guid = window.location.pathname.split('/').pop();
    const { lat, lng } = this.props;
    console.log(lat, lng)
    firebase
      .database()
      .ref(`server/tracking/${guid}`)
      .on('value', snapshot => {
        const trips = snapshot.val()
        var points = Object.values(trips.positions).map(item => ({ lat: Number(item.lat), lng: Number(item.lng)}));
        var bounds = new this.props.google.maps.LatLngBounds();
        points = [{ lat: Number(lat), lng: Number(lng) }, ...points];
        for (var i = 0; i < points.length; i++) {
          bounds.extend(points[i]);
        }
        this.setState({
          bounds,
          points
        })
      })
  }
  render() {
    const { points } = this.state;
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
        bounds={this.state.bounds}
      >
        {points && <Polyline
          fillColor="#367edb"
          fillOpacity={0.35}
          path={points}
          strokeColor="#367edb"
          strokeOpacity={0.8}
          strokeWeight={3}
        />}
        {points && <Marker
          title={'Posición actual'}
          name={'SOMA'}
          position={points[points.length-1]} />}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.TRACK_APP_MAPS_GEOCODE_KEY
})(MapContainer);