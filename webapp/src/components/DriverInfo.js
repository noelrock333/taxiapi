import React from 'react';

const DriverInfo = () => {
  return (
    <div className="info-card">
      <div className="title">Datos del taxista</div>
      <div>
        <div className="field-group">
          <label>Nombre:</label>
          <span>Noel Escobedo</span>
        </div>
        <div className="field-group">
          <label>Licencia:</label>
          <span>1234567</span>
        </div>
      </div>
    </div>
  );
}

export default DriverInfo;
