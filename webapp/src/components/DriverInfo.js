import React from 'react';

const DriverInfo = ({ driver }) => {
  const { user } = driver;
  return (
    <div className="info-card">
      <div className="title">Datos del taxista</div>
      <div className="content">
        <div className="field-group">
          <label>Nombre:</label>
          <span>{user.full_name}</span>
        </div>
        <div className="field-group">
          <label>Licencia:</label>
          <span>{driver.license_number}</span>
        </div>
      </div>
    </div>
  );
}

export default DriverInfo;
