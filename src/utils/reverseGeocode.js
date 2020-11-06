const request = require("request");
const reverseGeocode = (lat, lng, cb) => {
  const url = `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_TOKEN}&format=json&lat=${lat}&lon=${lng}`; //will encode special characters
  request({ url, json: true }, (error, res) => {
    if (error) {
      cb("Unable to connect to location services", undefined);
    } else {
      console.log(res.body);
      cb(undefined, {
        city: res.body.address.city,
      });
    }
  });
};

module.exports = reverseGeocode;
