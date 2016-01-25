var Relay = require('rpi-relay');
var r1 = new Relay(14);
var r2 = new Relay(15);

r1.off();
r2.on();

console.log('antes setInterval');
var iv = setInterval(function () {
  var statusR1 = r1.readSync() ^ 1;
  console.log('r1 ' + statusR1);

  if (statusR1 == 1) {
    r1.on();
  } else {
    r1.off();
  }

  var statusR2 = r2.readSync() ^ 1;
  console.log('r2 ' + statusR2);

  if (statusR2 == 1) {
    r2.on();
  } else {
    r2.off();
  }

}, 5000);

console.log('interval = ' + iv);

// Stop blinking the relay and turn it off after 5 seconds.
setTimeout(function () {
  clearInterval(iv); // Stop blinking
  r1.destroy();
}, 15000);
