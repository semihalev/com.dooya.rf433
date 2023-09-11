'use strict';

const { Device } = require('homey');
const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
  static RX_ENABLED = true;

  async onInit() {
    this.registerCapabilityListener('windowcoverings_state', this.onCapabilityWindowcoverings_state.bind(this));
  }

  async onAdded() {
    if (this.hasCapability('windowcoverings_state')) {
      await this.setCapabilityValue('windowcoverings_state', 'idle');
    }
  }

  async onCapabilityWindowcoverings_state(value, opts) {
    if (this.hasCapability('windowcoverings_state')) {
      await this.setCapabilityValue('windowcoverings_state', value);
    }

    let data = this.getData();
    data.state = value
    await this.driver.tx(data, {
      device: this,
    });
  }
}
