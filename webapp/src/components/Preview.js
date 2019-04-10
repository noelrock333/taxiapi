import React from 'react';
import { userInfo } from 'os';

const Preview = ({ vehicle, driver, togglePreview }) => {
  const { organization } = vehicle;
  const { user } = driver;
  return (
    <div className="preview" onClick={togglePreview}>
      <div className="title">Información del viaje</div>
      <div className="content">
        <p>{user.full_name}, {vehicle.number} de {organization.name}</p>
      </div>
    </div>
  )
}

export default Preview;
