'use strict';
// this is for using express library
const express = require('express');

// this is will manage who will be able to touch my server 
const cors = require('cors');

// this is DOTENV (read our enviroment) this is for using dotenv library 
require('dotenv').config();

// this is for the PORT it is sotred in .env file which is hidden online
const PORT = process.env.PORT || process.env.PORTTWO;

// this is for using express library with cool stuff
const server = express();

// this is available to everyone to use
server.use(cors());

//  this is the first route if there is no route this will be shown
server.get('/',(req,res)=>{
    res.status(200).send('you are doing a great job');
});

// this is for location route
server.get('/location',(req,res)=>{
    // this is the query to lookup requests
    const location = req.query.data;
    // this is for getting the data
    const locationJSON = require('./data/location.json');
    // here we made new objects
    const locationObj = new Location(location, locationJSON);
    // and this is the response
    res.send(locationObj);
});

// this is constructor for query the cities
function Location(location, locationData){
    this.search_query = location;
    this.formatted_query = locationData[0].display_name;
    this.latitude = locationData[0].lat;
    this.longitude =locationData[0].lon;
}

// this constructor is for weather query
server.get('/weather',(req,res)=>{
    // this is the route for lookup the weather 
    // const weath = req.query.data;
    // this for getting weather data from JSON file 
    const weatherJSON = require('./data/weather.json');
    // creating new objects 
    const weatherObj = new Weather(weatherJSON);
    //  the response will be here 
    res.send(weatherObj);
});

// this constructor for waether
function Weather(weatherData){
    for (let i = 0; i < weatherData.data.length; i++) {
        this.forecast = weatherData.data[i].weather.description;
        this.time = weatherData.data[i].valid_date;
    }
}

// [
//     {
//       "forecast": "Partly cloudy until afternoon.",
//       "time": "Mon Jan 01 2001"
//     },
//     {
//       "forecast": "Mostly cloudy in the morning.",
//       "time": "Tue Jan 02 2001"
//     },
//     ...
//   ]

//  this is for all faild routes that the user might insert
server.get('*',(req,res)=>{
    res.status(404).send('this page is not found');
});

// this is for problems or fixing issues a message will be shown to the user
server.use((Error,req,res)=>{
    res.status(500).send("Sorry, something went wrong");
});

// this is will tell the port to listen to this server I think
server.listen(PORT, ()=>{
    console.log(`do not kill me please ${PORT}`);
});