'use strict'

var NOT_INIT = 'Module heating not init';

function Heating () {
  var self = this;

  // Running on RPI
  if (process.platform == 'linux' && process.arch == 'arm') {
    console.log('FINE: IS RPI');
    var Gpio = require('onoff').Gpio;
    //var r1 = new Gpio(14, 'out');
    self.relay = new Gpio(14, 'out');
  } else {
    // Else, no RPI, so DUMMY
    console.log('FINE: IS NOT RPI');
    self.relay = {
      status : 'off',
      on : function () {
          console.log('DUMMY RELAY ON');
          this.status = 'on';
      },
      off : function () {
          console.log('DUMMY RELAY OFF');
          this.status = 'off';
      },
      readSync : function () {
          console.log('DUMMY RELAY READSYNC');
          return this.status;
      },
      writeSync : function (value) {
          console.log('DUMMY RELAY WRITESYNC');
          this.status = value;
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

  self.relay.writeSync(1);
};

Heating.prototype.off = function () {
  console.log('FINER: heating.off');
  var self = this;
  self.checkInit();

  self.relay.writeSync(0);
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
  self.relay.unexport();
  self.relay = null;
}

module.exports = Heating;
