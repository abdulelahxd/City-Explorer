"use strict";
// this is for using express library
const express = require("express");

// this is will manage who will be able to touch my server
const cors = require("cors");

// this is DOTENV (read our enviroment) this is for using dotenv library
require("dotenv").config();

// this will help us to get data from APIs and store them
const superagent = require("superagent");

// this is for the PORT it is sotred in .env file which is hidden online
const PORT = process.env.PORT || process.env.PORTTWO;

// this is for using express library with cool stuff
const server = express();

// this is available to everyone to use
server.use(cors());

// this is will tell the port to listen to this server I think
server.listen(PORT, () => {
  console.log(`do not kill me please ${PORT}`);
});

//  this is the first route if there is no route this will be shown
server.get("/", (req, res) => {
  res.status(200).send("you are doing a great job");
});

//////////////////////////// route One /////////////////////////////
// this is for location route
server.get("/location", (req, res) => {
  arrayFor = [];
  // this is the query
  const city = req.query.city;
  // this is for hidding the key in env file
  let key = process.env.LOCATION_KEY;
  // this will hit the APIs servers and get data
  let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  // super agent for storing the data that we request from the APIs servers
  superagent.get(url).then((geoData) => {
    const locationData = new Location(city, geoData.body);
    res.status(200).json(locationData);
  });
  ///////////////////// local way //////////////////////
  // this is the query to lookup requests
  // const location = req.query.data;
  // this is for getting the data
  // const locationJSON = require("./data/location.json");
  // here we made new objects
  // const locationObj = new Location(location, locationJSON);
  // and this is the response
  // res.send(locationObj);
});

let arrayFor = [];
// this is constructor for query the cities
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  arrayFor.push(this);
}

//////////////////////////// route Two /////////////////////////////
// this constructor is for weather query
server.get("/weather", (req, res) => {
  const city = req.query.city;
  // this is for hidding the key in env file
  let keyTwo = process.env.WEATHER_KEY;
  // this will hist the APIs servers and get data
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${arrayFor[0].latitude}&lon=${arrayFor[0].longitude}&key=${keyTwo}`;
  // super agent for storing the data that we request from the APIs servers
  superagent.get(url).then((weatherData) => {
    // this will get the information from the array of the response of the API server
    let weatherInfo = weatherData.body.data.map((val, idx) => {
      let weatherDescription = val.weather.description;
      let weatherDateTime = val.datetime;
      // creating new objects
      const weatherJSON = new Weather(weatherDescription, weatherDateTime);
      return weatherJSON;
    });
    res.send(weatherInfo);
  });
  // this constructor for waether
  function Weather(weatherDescription, weatherDateTime) {
    this.forecast = weatherDescription;
    this.time = new Date(weatherDateTime).toDateString();
  }
});

//////////////////////////// route Three /////////////////////////////
server.get("/trails", (req, res) => {
  // this is the query
  const city = req.query.city;
  // this is for hidding the key in env file
  let key = process.env.TRAILS_KEY;
  // this will hit the APIs servers and get data
  // let url = `https://www.hikingproject.com/data/get-trails?lat=${arrayFor[0].latitude}&lon=${arrayFor[0].longitude}&key=${key}`;
  let url = `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&key=${key}`;

  // super agent for storing the data that we request from the APIs servers
  superagent.get(url).then((hikingJSON) => {
    // console.log(hikingJSON.body);
    // const hikeInfo = new Hike(hikingJSON.body);

    res.send("trails works fine");
  });
});
// this is a constructor for the hikes
// function Hike(info) {
//   this.name = 
//   this.location =
//   this.length =
//   this.stars =
//   this.star_votes =
//   this.summary =
//   this.trail_url =
//   this.conditions =
//   this.condition_date =
//   this.condition_time = 
// }

//  this is for all faild routes that the user might insert
server.get("*", (req, res) => {
  res.status(404).send("this page is not found");
});

// this is for problems or fixing issues a message will be shown to the user
server.use((Error, req, res) => {
  res.status(500).send("Sorry, something went wrong");
});