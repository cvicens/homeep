//var async = require('async');
var express = require('express');
var app = express();

var util = require('util');
var eep = require('eep');

var heatingTimeout = null;

var Heating = require('./lib/heating');
var heating = new Heating();

var DEFAULT_TIMER = 1; // TODO REVIEW!!!!

var BASE_LINE_TEMP = 20;
var BASE_LINE_TOLERANCE = 0.1;

var monotonics = {};
var monotonic_avg = eep.EventWorld.make().windows().monotonic(eep.Stats.all, new eep.CountingClock());
monotonic_avg.on('emit', function(values) {
  var hi_temp = BASE_LINE_TEMP + BASE_LINE_TOLERANCE;
  var lo_temp = BASE_LINE_TEMP - BASE_LINE_TOLERANCE;

  if (values['mean'] != 0) {
    console.log("AVG (all) => " + JSON.stringify(values));
    if (values['mean'] != 0) {
      if (values['mean'] < lo_temp ) {
        console.log("turn ON heating! " + values['mean'] + ' <= ' + lo_temp);
        turnOnHeating();
      } else if (values['mean'] > hi_temp) {
        console.log("turn OFF heating! " + values['mean'] + ' > ' + hi_temp);
        turnOffHeating();
      } else {
        console.log('Do nothing! ' + lo_temp + ' <= ' + values['mean'] + ' <= ' + hi_temp);
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

function turnOnHeating (minutes) {
  if (typeof minutes === 'undefined' || minutes < 0) {
     minutes = DEFAULT_TIMER;
  }

  // Set a timout for X minutes, calcel previous timer
  if (heatingTimeout) {
    clearTimeout(heatingTimeout);
  }

  heatingTimeout = setTimeout(function() {
    console.log('FINER: time out reached!');
    // Stop the heating
    heating.off ();
  }, minutes * 60 * 1000);

  // turn on the heating
  heating.on();
}

function turnOffHeating () {
  // clear timer
  clearTimeout(heatingTimeout);

  // turn off the heating
  heating.off();
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
  var presence = false;
  var sensorId = req.params.sensorId;

  manageTemperatureMeasurement(sensorId, temp, presence);

  res.send({ name: req.params.sensorId, temp: req.params.temp });
});

// Heting command: on/off
app.put('/heating/:cmd/:minutes*?', function (req, res) {
  var cmd = req.params.cmd;
  var minutes = req.params.minutes;
  console.log('FINE: /heating/' + cmd + '/' + minutes);
  if (typeof minutes === 'undefined') {
     minutes = DEFAULT_TIMER;
  }

  var resp = null, desc = null;
  if (cmd == 'on' || cmd == 'ON') {
      if (minutes > 0) {
        turnOnHeating (minutes);
        resp = 'ACK';
        desc = 'Heating ON';
      } else {
        // Bad cmd
        resp = 'NACK';
        desc = 'Bad command: ' + cmd + ' minutes: ' + minutes;
      }
  } else if (cmd == 'off' || cmd == 'OFF') {
      turnOffHeating ();
      resp = 'ACK';
      desc = 'Heating OFF';
  } else {
      // Bad cmd
      resp = 'NACK';
      desc = 'Bad command: ' + cmd + ' minutes: ' + minutes;
  }

  res.send({ cmd: cmd, resp: resp, desc: desc });
});

// Heting command: on/off
app.get('/heating/status', function (req, res) {
  var response = null, desc = null;
  var resp = null, desc = null;
  var status = heating.status();
  resp = 'ACK';
  desc = 'Heating ' + (status == 1 ? 'ON' : 'OFF');

  res.send({ status: status, resp: resp, desc: desc });
});

app.listen(3000);
