require("dotenv").config();

//load the file system module
var fs = require('fs');
//load twitter
var Twitter = require('twitter');
 //load Auth keys for Twitter
var keys = require('./keys.js')
//load Spotify
var spotify = require('spotify');
//load request
var request = require('request');

// take two arguments
var action = process.argv[2];
var value = process.argv[3];
var logData = "";

// We will then create a switch-case statement (if-then would also work).
// The switch-case will direct which function gets run.
function processArgs() {
    switch(action){
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
            searchSpotify();
            break;
        case 'movie-this':
            searchMovie();
            break;
        case 'do-what-it-says':
            readFileExecute();
            break;
        }
    }
    
    processArgs();

    //function to get last 20 tweets from twitter 
function getTweets() { 
    //create a twitter instance
    var twitter = new Twitter(keys.twitterKeys);
    twitter.get('statuses/user_timeline', {screen_name: 'sarahav', count: 20}, function(err, tweets, response){
      if (!err && response.statusCode == 200) {
          console.log("------------------------------------------");
          console.log(" " + " " + "My last 20 Tweets" + " " + " ")
          console.log("------------------------------------------");
          for (var i = 0; i < tweets.length; i++) {
              console.log(tweets[i].created_at + " " + tweets[i].text)
              logData = [tweets[i].created_at + " " + tweets[i].text + "," + " "];
            writeLog();
          }
      }
    });
    }

//search spotify for info on song
function searchSpotify() {
    var value = process.argv[3] || "what's my age again";
    spotify.search({ type: 'track', query: value }, function(err, data) {
        if (!err) {
            console.log("------------------------------------------");
              console.log(" " + " " + "Spotify Results" + " " + " ")
              console.log("------------------------------------------");
            console.log('Artist(s): ' + data.tracks.items[0].artists[0].name)
            console.log('Song Name: ' + data.tracks.items[0].name);
            console.log('Preview Link: ' + data.tracks.items[0].preview_url);
            console.log('Album: ' + data.tracks.items[0].album.name);
            logData = {Artists: data.tracks.items[0].artists[0].name, songName: data.tracks.items[0].name, previewLink: data.tracks.items[0].preview_url, Album: data.tracks.items[0].album.name};
            writeLog();
        }
     });
    }
//search OMBD for data on movie name passed as argument
//read text file and execute arguments
//write