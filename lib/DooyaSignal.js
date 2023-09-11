'use strict';

const { RFSignal, RFError, RFUtil } = require('homey-rfdriver');

const numberToCmdString = cmd => cmd.toString(2).padStart(4, '0');

const commandMap = new Map([
	['up', numberToCmdString(0xE)],
	['idle', numberToCmdString(0xA)],
	['down', numberToCmdString(0xC)],
]);

const stateMap = new Map(Array.from(commandMap.entries()).map(entry => {
	return entry.reverse();
}));

module.exports = class extends RFSignal {
	static FREQUENCY = '433';
	static ID = 'dooya';

	static payloadToCommand(payload) {
		if (stateMap.has(RFUtil.bitArrayToString(payload.slice(32, 36)))) {
			const data = {
				address: RFUtil.bitArrayToString(payload.slice(0, 24)),
				channel: RFUtil.bitArrayToString(payload.slice(24, 32)),
				group: false,
				state: stateMap.get(RFUtil.bitArrayToString(payload.slice(32, 36))),
			};
			data.id = `${data.address}:${data.channel}`;
			return data;
		}
		return null;
	}

	static commandToPayload(data) {
		if (data) {
			const command = commandMap.get(data.state);
			if (command) {
				const address = RFUtil.bitStringToBitArray(data.address);
				const channel = RFUtil.bitStringToBitArray(data.channel);
				const state = command.split('').map(Number)
				const check = state.slice(0,3);

				const payload = [].concat(address, channel, state, check);
				return payload
			}
		}
		return null;
	}

	static commandToDeviceData(data) {
		return data;
	}

	static createPairCommand() {
		const data = {
			address: RFUtil.generateRandomBitString(24),
			channel: `00${RFUtil.generateRandomBitString(4)}`,
			group: false,
			state: 'idle',
			check: '000'
		};
		data.channel = data.channel === '000000000000' ? '000000000001' : data.channel;
		data.id = `${data.address}:${data.channel}`;
		return data;
	}
};
