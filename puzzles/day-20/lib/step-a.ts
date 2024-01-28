enum PulsePower {
	LOW = 0,
	HIGH = 1,
}

enum Switch {
	OFF = 0,
	ON = 1,
}

enum Module {
	BROADCASTER = 0,
	FLIPFLOP = 1,
	CONJUNCTION = 2,
}

interface Memory {
	[sender: string]: PulsePower;
}

interface Device {
	name: string;
	module: Module;
	targets: Array<string>;
	state: Switch;
	memory: Memory;
}

interface Devices {
	[name: string]: Device;
}

interface Pulse {
	sender: string;
	target: string;
	pulse: PulsePower;
}

const devices: Devices = {};

let futurePulses: Array<Pulse> = [];

let outputName: string = "";

let numLowPulses: number = 0;
let numHighPulses: number = 0;

export function run(input: Array<string>): number {
	init(input);

	fillMemoryOfAllConjunctionDevices();

	for (let i = 0; i < 1000; i++) runOnce();

	return numLowPulses * numHighPulses;
}

function init(input: Array<string>): void {
	for (const line of input) {
		const parts = line.trim().split(" -> ");
		const targets = (parts.pop() as string).split(", ");
		const token = parts.shift() as string;

		let name = "broadcaster";
		let module = Module.BROADCASTER;

		if (token[0] === "%") {
			name = token.substring(1);
			module = Module.FLIPFLOP;
		} else if (token[0] === "&") {
			name = token.substring(1);
			module = Module.CONJUNCTION;
		}

		devices[name] = { name, module, targets, state: Switch.OFF, memory: {} };
	}
}

function fillMemoryOfAllConjunctionDevices(): void {
	for (const device of Object.values(devices))
		for (const target of device.targets)
			fillMemoryOfConjunctionDevice(device.name, target);
}

function fillMemoryOfConjunctionDevice(sender: string, target: string): void {
	const device = devices[target];

	if (!device) {
		outputName = target;
		return;
	}

	if (device.module !== Module.CONJUNCTION) return;

	device.memory[sender] = PulsePower.LOW;
}

function runOnce(): void {
	numLowPulses += 1;

	broadcast(PulsePower.LOW);

	while (futurePulses.length !== 0) {
		const pulses = futurePulses;
		futurePulses = [];
		dispatchPulses(pulses);
	}
}

function schedulePulse(
	sender: string,
	target: string,
	pulse: PulsePower,
): void {
	futurePulses.push({ sender, target, pulse });
}

function dispatchPulses(pulses: Array<Pulse>): void {
	for (const { sender, target, pulse } of pulses)
		receivePulse(sender, target, pulse);
}

function broadcast(pulse: PulsePower): void {
	const device = devices.broadcaster as Device;
	for (const target of device.targets)
		schedulePulse(device.name, target, pulse);
}

function receivePulse(sender: string, target: string, pulse: PulsePower): void {
	switch (pulse) {
		case PulsePower.LOW:
			numLowPulses += 1;
			break;
		case PulsePower.HIGH:
			numHighPulses += 1;
	}

	if (target === outputName) return;

	const device = devices[target] as Device;

	switch (device.module) {
		case Module.BROADCASTER:
			broadcast(pulse);
			break;
		case Module.FLIPFLOP:
			flipflopReceivePulse(device, pulse);
			break;
		case Module.CONJUNCTION:
			conjunctionReceivePulse(device, sender, pulse);
	}
}

function flipflopReceivePulse(device: Device, pulse: PulsePower): void {
	if (pulse === PulsePower.HIGH) return;

	const newPulse =
		device.state === Switch.ON ? PulsePower.LOW : PulsePower.HIGH;

	device.state = device.state === Switch.ON ? Switch.OFF : Switch.ON;

	for (const target of device.targets)
		schedulePulse(device.name, target, newPulse);
}

function conjunctionReceivePulse(
	device: Device,
	sender: string,
	pulse: PulsePower,
): void {
	device.memory[sender] = pulse;

	let lows = 0;
	let highs = 0;

	for (const pulsePower of Object.values(device.memory)) {
		if (pulsePower === PulsePower.LOW) lows += 1;
		else if (pulsePower === PulsePower.HIGH) highs += 1;
	}

	const newPulse = lows === 0 ? PulsePower.LOW : PulsePower.HIGH;

	for (const target of device.targets)
		schedulePulse(device.name, target, newPulse);
}
