//var async = require('async');
var express = require('express');
var app = express();

var util = require('util');
var eep = require('eep');

var monotonics = {};
var monotonic_avg = eep.EventWorld.make().windows().monotonic(eep.Stats.all, new eep.CountingClock());
monotonic_avg.on('emit', function(values) {
  if (values['mean'] != 0) {
    console.log("AVG (all) => " + JSON.stringify(values));
    if (values['mean'] != 0) {
      if (values['mean'] < 20) {
        console.log("turn ON heating!");
      } else {
        console.log("turn OFF heating!");
      }
    }
  }
});


var intervalTickAvg = setInterval(monotonic_avg.tick, 10000);

function tickMonotonics() {
  for (var i in monotonics) {
    monotonics[i].tick();
  }
}
var intervalTick = setInterval(tickMonotonics, 5000);

// Deal with the temperature values
function manageTemperatureMeasurement (sensorId, temp, presence) {
  if (monotonics[sensorId]) {
    //// Your business logic here!
  } else {
    monotonics[sensorId] = eep.EventWorld.make().windows().monotonic(eep.Stats.all, new eep.CountingClock());
    monotonics[sensorId].on('emit', function(values) {
      if (values['mean'] != 0) {
        console.log("id: " + sensorId + " => " + JSON.stringify(values));
        monotonic_avg.enqueue(values['mean']);
      }
    });
  }

  // Enqueue data on corresponding window
  monotonics[sensorId].enqueue(temp);
}

// temp measurement
app.get('/temp/:sensorId/:temp/:presence', function (req, res) {
  var temp = new Number(req.params.temp);
  var presence = req.params.presence == "true";
  var sensorId = req.params.sensorId;

  manageTemperatureMeasurement(sensorId, temp, presence);

  res.send({ name: req.params.sensorId, temp: req.params.temp });
});

// temp measurement
app.get('/temp/:sensorId/:temp', function (req, res) {
  var temp = new Number(req.params.temp);
  var presence = req.params.presence == "true";
  var sensorId = req.params.sensorId;

  manageTemperatureMeasurement(sensorId, temp, presence);

  res.send({ name: req.params.sensorId, temp: req.params.temp });
});

app.listen(3000);
