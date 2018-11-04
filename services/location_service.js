const Location = require("../models/location");
const Driver = require("../models/driver");

class InvalidLatitudeError extends Error {}
class InvalidLongitudeError extends Error {}

function validateLatitude(lat) {
  if (typeof lat != "number" || lat < -90 || lat > 90) {
    throw new InvalidLatitudeError();
  }
}

function validateLongitude(lon) {
  if (typeof lon != "number" || lon < -180 || lon > 180) {
    throw new InvalidLongitudeError();
  }
}

function updateLocation(user_id, longitude, latitude, reported_at) {
  validateLatitude(latitude);
  validateLongitude(longitude);
  return new Location({
    latitude,
    longitude,
    user_id,
    reported_at,
    postgis_lat: latitude,
    postgis_long: longitude
  }).save(null, { method: "insert" });
}

async function getClosestFreeDrivers(longitude, latitude) {
  validateLatitude(latitude);
  validateLongitude(longitude);

  freeDrivers = await new Driver()
    .where({ status: "free", push_notifications: true })
    .fetchAll({ withRelated: ["user"] });

  freeDrivers = freeDrivers.toJSON();

  locations = await new Location()
    .query(q => {
      q.distinct("driver_id")
        .select()
        .whereIn("driver_id", freeDrivers.map(d => d.id))
        .orderBy("driver_id")
        .orderBy("reported_at", "desc")
        .orderByRaw(
          `coordinate <-> st_setsrid(st_makepoint(${longitude},${latitude}),4326)`
        )
        .limit(100);
    })
    .fetchAll();

  locations = locations.toJSON();
  return locations.map(l => freeDrivers.find(d => d.id === l.driver_id));
}

module.exports = {
  updateLocation,
  getClosestFreeDrivers,
  InvalidLatitudeError,
  InvalidLongitudeError
};
