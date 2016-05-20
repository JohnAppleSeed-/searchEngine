var fs         = require('fs');
var redis      = require('redis');
var client     = redis.createClient();
var mongoose   = require('mongoose');
var colors     = require('colors');

mongoose.connect("mongodb://localhost:27017/scratch", 
  function(err) {
    if (err) { 
      console.log("ERROR: something went ".red        +
                  "wrong connecting to MongoDB. ".red +
                  "Are you sure you've started ".red  +
                  "the service?".red);
    } else {
      console.log('Successfully connected to MongoDB!'.green);
      getCol();
    }
});

var searches = new mongoose.Schema({
  city:{},
  loc:{},
  pop:{},
  state:{},
  created: { type: Date, default: Date.now }
});

var search = mongoose.model('search', searches);
var city  = '';
var loc   = '';
var pop   = '';
var state = '';
var addArr = [];



function getCol() {
  fs.readFile('zips.json', 'UTF-8', function(err, data) {
    var stuff = (data.split('\n'));
    for (var i = 0, j = stuff.length-1; i < j; i++) {
    console.log("creating mongo documents... " + i + " of " + j )
      city  = JSON.parse(stuff[i]).city;
      loc   = JSON.parse(stuff[i]).loc;
      pop   = JSON.parse(stuff[i]).pop;
      state = JSON.parse(stuff[i]).state;

      var newsearch = new search({
        city : city,
        loc  : loc, 
        pop  : pop,
        state: state
      });
      if (i === j-1) {
        console.log("Saving documents and adding the lookup IDs to redis... this might take a minute...")
      }
      newsearch.save(function(err, newStuff) {
        j = j-1;
        if (j === 0) {
          console.log("DONE!")
          process.exit(0)
        }
        if (err) {
          console.log(err);
        } else {
          for (var q in addArr) {
          var zArr = ['searches0', 1, addArr[q]];
          client.zadd(zArr, function(err) {
            if (err) {
              console.log(err);
            }
          });
          client.sadd(addArr[q], newStuff._id.toString(), function(err) {
            if (err) console.log(err);
          });       
          };
        }
      });
    }
  });
}

