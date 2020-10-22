const request = require("request");
const forecast = (longitude, latitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.FORECAST_KEY}&query=${latitude},${longitude}&units=m`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {
      callback("unable to find location", undefined);
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} C. There is a ${body.current.precip}% chance of rain`,
        body.current.weather_icons[0]
      );
      console.log(body);
    }
  });
};

module.exports = forecast;
