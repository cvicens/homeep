'use strict'

var NOT_INIT = 'Module heating not init';

function Heating () {
  var self = this;

  // Running on RPI
  if (process.platform == 'linux' && process.arch == 'arm') {
    console.log('FINE: IS RPI');

    var Relay = require('rpi-relay');
    self.relay = new Relay(14);
  } else {
    // Else, no RPI, so DUMMY
    console.log('FINE: IS NOT RPI');
    self.relay = {
      status : 'off',
      on : function () {
          console.log('DUMMY RELAY ON');
      },
      off : function () {
          console.log('DUMMY RELAY OFF');
      },
      readSync : function () {
          console.log('DUMMY RELAY READSYNC');
          return this.status;
      },
      writeSync : function (value) {
          console.log('DUMMY RELAY WRITESYNC value: ' + value);
          this.status = value;
      },
      destroy : function () {
          console.log('DUMMY RELAY DESTROY');
          this.status = 'off';
      },
      unexport : function () {
          console.log('DUMMY RELAY UNEXPORT');
          this.status = 'off';
      }
    };
  }

}

Heating.prototype.checkInit = function () {
  var self = this;
  if (!self.relay) {
    throw NOT_INIT;
  }
}

Heating.prototype.on = function () {
  console.log('FINER: heating.on');
  var self = this;
  self.checkInit();

  self.relay.on();
};

Heating.prototype.off = function () {
  console.log('FINER: heating.off');
  var self = this;
  self.checkInit();

  self.relay.off();
  console.log('FINER: after heating.off');
};

Heating.prototype.status = function () {
  var self = this;
  self.checkInit();

  return self.relay.readSync();
};

Heating.prototype.destroy = function() {
  var self = this;
  self.checkInit();

  self.off();
  self.relay.destroy();
  self.relay = null;
}

module.exports = Heating;
