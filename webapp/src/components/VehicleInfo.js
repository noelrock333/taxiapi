import React from 'react';

const VehicleInfo = () => {
  return (
    <div className="info-card">
      <div className="title">Datos del taxi</div>
      <div className="content">
        <div className="field-group">
          <label>Sitio:</label>
          <span>Guadalajarita</span>
        </div>
        <div className="field-group">
          <label>Número:</label>
          <span>3</span>
        </div>
      </div>
    </div>
  );
}

export default VehicleInfo;
