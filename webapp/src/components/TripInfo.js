import React from 'react';

const TripInfo = ({ trip }) => {
  return (
    <div className="info-card">
      <div className="title">Datos del viaje</div>
      <div className="content">
        <div className="field-group">
          <label>Origen:</label>
          <span>{trip.address_origin}</span>
        </div>
        <div className="field-group">
          <label>Destino:</label>
          <span>{trip.address_destination}</span>
        </div>
      </div>
    </div>
  );
}

export default TripInfo;
