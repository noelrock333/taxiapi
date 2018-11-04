const Location = require("../models/location");
const { buildUser } = require("../test/factories/user_factory");
const { buildDriver } = require("../test/factories/driver_factory");
const {
  updateLocation,
  InvalidLongitudeError,
  InvalidLatitudeError
} = require("./location_service");

describe("location_service", () => {
  let client1;
  let client2;
  let driver1;
  let driver2;
  let driver3;
  beforeEach(async () => {
    client1 = await buildUser().save();
    client2 = await buildUser().save();

    driver1 = await buildUser().save();
    driver2 = await buildUser().save();
    driver3 = await buildUser().save();

    driver1 = await buildDriver({ user_id: driver1.id }).save();
    driver2 = await buildDriver({ user_id: driver2.id }).save();
    driver3 = await buildDriver({ user_id: driver3.id }).save();
  });

  describe("updateLocation", () => {
    it("throws with invalid latitude", async () => {
      expect(() => {
        updateLocation(0, 100, 91, new Date());
      }).toThrowError(InvalidLatitudeError);
      expect(() => {
        updateLocation(0, 100, -91, new Date());
      }).toThrowError(InvalidLatitudeError);

      expect(() => {
        updateLocation(0, 100, "45", new Date());
      }).toThrowError(InvalidLatitudeError);
    });
    it("throws with invalid longitude", async () => {
      expect(() => {
        updateLocation(0, -181, 45, new Date());
      }).toThrowError(InvalidLongitudeError);
      expect(() => {
        updateLocation(0, 181, 45, new Date());
      }).toThrowError(InvalidLongitudeError);

      expect(() => {
        updateLocation(0, "100", 45, new Date());
      }).toThrowError(InvalidLongitudeError);
    });
    it("throws with invalid data", async () => {
      expect.assertions(2);
      try {
        await updateLocation(null, 0, 0, new Date());
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual(
          'insert into "locations" ("coordinate", "created_at", "latitude", "longitude", "reported_at", "updated_at", "user_id") values (ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3, $4, $5, $6, $7, $8) returning "id" - null value in column "user_id" violates not-null constraint'
        );
      }
    });
    it("updates user location", async () => {
      await updateLocation(
        client1.id,
        -103.7335,
        19.2452,
        new Date(1540154731145)
      );
      expect(await new Location({ user_id: client1.id }).fetchAll()).toEqual([
        expect.objectContaining({
          coordinate: "0101000020E6100000ADFA5C6DC53E3340931804560E1153C0",
          latitude: 19.2452,
          longitude: -103.733,
          postgis_lat: 19.2452,
          postgis_long: -76.2665,
          user_id: client1.id
        })
      ]);
    });
  });
});
