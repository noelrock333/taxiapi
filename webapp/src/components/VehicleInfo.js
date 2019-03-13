import React from 'react';

const VehicleInfo = ({ vehicle }) => {
  const { organization } = vehicle;
  return (
    <div className="info-card">
      <div className="title">Datos del taxi</div>
      <div className="content">
        <div className="field-group">
          <label>Sitio:</label>
          <span>{organization.name}</span>
        </div>
        <div className="field-group">
          <label>Número:</label>
          <span>{vehicle.number}</span>
        </div>
      </div>
    </div>
  );
}

export default VehicleInfo;
