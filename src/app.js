const express = require("express");
const path = require("path");
const process = require("process");
const cors = require("cors");
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const reverseGeocode = require("./utils/reverseGeocode");
console.log(path.join(__dirname, "../public"));
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
require("dotenv").config();
//Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
//setup static directory to serve
app.use(express.static(publicDirectoryPath)); //way to customise our folder
app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Vivek Varma",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Vivek Varma",
  });
});
app.get("/location", (req, res) => {
  console.log("here");
  if (!req.query.lat || !req.query.lng) {
    return res.status(400).send("something went wrong");
  }
  reverseGeocode(req.query.lat, req.query.lng, (error, address) => {
    if (error) {
      return res.send({ error });
    } else {
      geoCode(address.city, (error, { latitude, longitude, location } = {}) => {
        if (location) {
          // console.log(data);
          return forecast(longitude, latitude, (error, forecastData, icon) => {
            if (forecastData) {
              //     street: body.locations[0].street,

              return res.send({
                address: location,
                forecast: forecastData,
                icon: icon,
              });
            }
            return res.send({ error });
          });
        }
        return res.send({ error });
      });
    }
  });
});
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "provide an address",
    });
  }
  const address = req.query.address;
  geoCode(address, (error, { latitude, longitude, location } = {}) => {
    if (location) {
      // console.log(data);
      return forecast(longitude, latitude, (error, forecastData, icon) => {
        if (forecastData) {
          return res.send({
            address: location,
            forecast: forecastData,
            icon: icon,
          });
        }
        return res.send({ error });
      });
    }
    return res.send({ error });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Vivek Varma",
    message: "Please try searching some other term",
  });
});
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Vivek Varma",
    message: "Please try some other url",
  });
});

app.listen(port, () => {
  console.log("Server is up on port 3000");
});
//the process of starting a server is async
//req.query
//HTTP request has a single request that goes to the server and a single response that comes back

//to make the API_KEYS private - I needed to add a config vars to heroku and use dotenv in my app.js
