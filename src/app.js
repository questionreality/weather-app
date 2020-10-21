const express = require("express");
const path = require("path");
const process = require("process");
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");
console.log(path.join(__dirname, "../public"));
const app = express();
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
app.get("/help", (req, res) => {
  res.render("help", {
    message: "Hello there",
    title: "Help",
    name: "Vivek Varma",
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
      return forecast(longitude, latitude, (error, forecastData) => {
        if (forecastData) {
          return res.send({
            address: location,
            forecast: forecastData,
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


