var util = require('util');
var eep = require('eep');

var stats = [
  eep.Stats.count, eep.Stats.sum, eep.Stats.min, eep.Stats.max,
  eep.Stats.mean, eep.Stats.vars, eep.Stats.stdevs
];
var headers = [ 'Count\t\t', 'Sum\t\t', 'Min\t\t', 'Max\t\t', 'Mean\t\t', 'Variance\t', 'Stdev\t\t' ];
var monotonic  = eep.EventWorld.make().windows().monotonic(eep.Stats.all, new eep.CountingClock());

monotonic.on('emit', function(values) {
  console.log(JSON.stringify(values));
});


//// NEW CARLOS
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateData () {
  var rndValue = getRandomInt(0, 100);
  //console.log ("New value: " + rndValue);
  monotonic.enqueue(rndValue);
}

var intervalUid = setInterval(generateData, 500);
var intervalTick = setInterval(monotonic.tick, 10000);
