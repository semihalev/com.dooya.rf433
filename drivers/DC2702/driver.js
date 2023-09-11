'use strict';

const { RFDriver } = require('homey-rfdriver');
const DooyaSignal = require('../../lib/DooyaSignal');

module.exports = class extends RFDriver {
  static SIGNAL = DooyaSignal;
}
