'use strict'

var NOT_INIT = 'Module lcd not init';

function LCD () {
  var self = this;

  // Running on RPI
  if (process.platform == 'linux' && process.arch == 'arm') {
    console.log('FINE: IS RPI');

    var LCD = require('rpi-lcd');
    self.lcd = new LCD('/dev/i2c-1', 0x3F);
    self.lcd.createChar( 0,[ 0x1B,0x15,0x0E,0x1B,0x15,0x1B,0x15,0x0E] ).createChar( 1,[ 0x0C,0x12,0x12,0x0C,0x00,0x00,0x00,0x00] );
  } else {
    // Else, no RPI, so DUMMY
    console.log('FINE: IS NOT RPI');
    self.lcd = {
      status : 'off',
      write : function (x, c) {
          console.log('DUMMY LCD WRITE: x: ' + x + ' c:' + c);
          return self;
      },
      clear : function () {
          console.log('DUMMY LCD CLEAR');
          return self;
      },
      print : function (str) {
          console.log('DUMMY LCD print: str: ' + str);
          return self;
      },
      cursorFull : function () {
          console.log('DUMMY LCD CURSOR_FULL');
          return self;
      },
      cursorUnder : function () {
          console.log('DUMMY LCD CURSOR_UNDER');
          return self;
      },
      setCursor : function (x, y) {
          console.log('DUMMY LCD SET_CURSOR x: ' + x + ' y: ' + y);
          return self;
      },
      home : function () {
          console.log('DUMMY LCD HOME');
          return self;
      },
      blinkOff : function () {
          console.log('DUMMY LCD BLINK_OFF');
          return self;
      },
      blinkOn : function () {
          console.log('DUMMY LCD BLINK_ON');
          return self;
      },
      cursorOff : function () {
          console.log('DUMMY LCD CURSOR_OFF');
          return self;
      },
      cursorOn : function () {
          console.log('DUMMY LCD CURSOR_ON');
          return self;
      },
      setBacklight : function (val) {
          console.log('DUMMY LCD setBacklight val: ' + val);
          return self;
      },
      setContrast : function (val) {
          console.log('DUMMY LCD setContrast val: ' + val);
          return self;
      },
      off : function () {
          console.log('DUMMY LCD OFF');
          this.status = 'off';
          return self;
      },
      on : function () {
          console.log('DUMMY LCD ON');
          this.status = 'on';
          return self;
      }
    };
  }
}

LCD.prototype.checkInit = function () {
  var self = this;
  if (!self.lcd) {
    throw NOT_INIT;
  }
}

LCD.prototype.printHeatingStatus = function (status) {
  console.log('FINER: lcd.printHeatingStatus status: ' + status);
  var self = this;
  self.checkInit();

	return self.setCursor(0,1).print('HEAT: ' + status == 1 ? 'OFF' : ' ON');
}

LCD.prototype.printAvgTemperature = function (temp) {
  console.log('FINER: lcd.printAvgTemperature');
  var self = this;
  self.checkInit();

  var s = new Date().toString().substring(16, 21);
	return self.setCursor(0,0).print(s + ' C ' + Math.round(temp * 100) / 100);
}

LCD.prototype.write = function (x, c) {
  console.log('FINER: lcd.write');
  var self = this;
  self.checkInit();

	return self.lcd.write(x, c);
}

LCD.prototype.clear = function () {
  console.log('FINER: lcd.clear');
  var self = this;
  self.checkInit();

	return self.lcd.clear();
}

LCD.prototype.print = function (str) {
  console.log('FINER: lcd.print');
  var self = this;
  self.checkInit();

	return self.lcd.print(str);
}

/** flashing block for the current cursor */
LCD.prototype.cursorFull = function () {
  console.log('FINER: lcd.cursorFull');
  var self = this;
  self.checkInit();

  return self.lcd.cursorFull();
}

/** small line under the current cursor */
LCD.prototype.cursorUnder = function () {
  console.log('FINER: lcd.cursorUnder');
  var self = this;
  self.checkInit();

  return self.lcd.cursorUnder();
}

/** set cursor pos, top left = 0,0 */
LCD.prototype.setCursor = function (x, y) {
  console.log('FINER: lcd.setCursor');
  var self = this;
  self.checkInit();

  return self.lcd.setCursor(x, y);
}

/** set cursor to 0,0 */
LCD.prototype.home = function () {
  console.log('FINER: lcd.home');
  var self = this;
  self.checkInit();

  return self.lcd.home();
}

/** Turn underline cursor off */
LCD.prototype.blinkOff = function () {
  console.log('FINER: lcd.blinkOff');
  var self = this;
  self.checkInit();

  return self.lcd.blinkOff();
}

/** Turn underline cursor on */
LCD.prototype.blinkOn = function () {
  console.log('FINER: lcd.blinkOn');
  var self = this;
  self.checkInit();

  return self.lcd.blinkOn();
}

/** Turn block cursor off */
LCD.prototype.cursorOff = function () {
  console.log('FINER: lcd.cursorOff');
  var self = this;
  self.checkInit();

  return self.lcd.cursorOff();
}

/** Turn block cursor on */
LCD.prototype.cursorOn = function () {
  console.log('FINER: lcd.cursorOn');
  var self = this;
  self.checkInit();

  return self.lcd.cursorOn();
}

/** setBacklight */
LCD.prototype.setBacklight = function (val) {
	console.log('FINER: lcd.setBacklight');
  var self = this;
  self.checkInit();

  return self.lcd.setBacklight(val);
}

/** setContrast stub */
LCD.prototype.setContrast = function (val) {
  console.log('FINER: lcd.setContrast');
  var self = this;
  self.checkInit();

  return self.lcd.setContrast(val);
}

/** Turn display off */
LCD.prototype.off = function () {
  console.log('FINER: lcd.off');
  var self = this;
  self.checkInit();

  return self.lcd.off();
}

/** Turn display on */
LCD.prototype.on = function () {
	console.log('FINER: lcd.on');
  var self = this;
  self.checkInit();

  return self.lcd.on();
}

LCD.prototype.createChar = function (ch, data) {
  console.log('FINER: lcd.createChar');
  var self = this;
  self.checkInit();

  return self.lcd.createChar(ch, data);
};


LCD.prototype.destroy = function() {
  var self = this;
  self.checkInit();

  self.off();
  // TODO self.lcd.destroy();
  self.lcd = null;
}

module.exports = LCD;
