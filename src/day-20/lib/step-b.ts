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

interface Feeders {
	[name: string]: number;
}

interface Pulse {
	sender: string;
	target: string;
	pulse: PulsePower;
}

const devices: Devices = {};

const mainFeeders: Feeders = {};

let futurePulses: Array<Pulse> = [];

let numButtonPresses: number = 0;

export function run(input: Array<string>): number {
	init(input);

	fillMemoryOfAllConjunctionDevices();

	const ultimateFeeder = findUltimateFeeder();
	fillMainFeeders(ultimateFeeder);

	while (true) {
		const result = runOnce();
		if (result !== undefined) return result;
	}
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

function tryFinish(): undefined | number {
	const vals = Object.values(mainFeeders);
	if (vals.includes(-1)) return;
	return lowestCommonMultiple(vals);
}

function lowestCommonMultiple(vals: Array<number>): number {
	const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

	const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

	let low = vals[0] as number;
	for (let i = 1; i < vals.length; i++) low = lcm(low, vals[i] as number);
	return low;
}

function fillMemoryOfAllConjunctionDevices(): void {
	for (const device of Object.values(devices))
		for (const target of device.targets)
			fillMemoryOfConjunctionDevice(device.name, target);
}

function fillMemoryOfConjunctionDevice(sender: string, target: string): void {
	const device = devices[target];

	if (!device) return;

	if (device.module !== Module.CONJUNCTION) return;

	device.memory[sender] = PulsePower.LOW;
}

function findUltimateFeeder(): string {
	for (const device of Object.values(devices))
		if (device.targets.includes("rx")) return device.name;

	throw new Error("No ultimate feeder found.");
}

function fillMainFeeders(ultimateFeeder: string): void {
	for (const device of Object.values(devices)) {
		if (!device.targets.includes(ultimateFeeder)) continue;
		mainFeeders[device.name] = -1;
	}
}

function runOnce(): undefined | number {
	numButtonPresses += 1;

	broadcast(PulsePower.LOW);

	while (futurePulses.length !== 0) {
		const pulses = futurePulses;
		futurePulses = [];

		const result = dispatchPulses(pulses);
		if (result !== undefined) return result;
	}

	return;
}

function schedulePulse(
	sender: string,
	target: string,
	pulse: PulsePower,
): void {
	futurePulses.push({ sender, target, pulse });
}

function dispatchPulses(pulses: Array<Pulse>): undefined | number {
	for (const { sender, target, pulse } of pulses) {
		const result = receivePulse(sender, target, pulse);
		if (result !== undefined) return result;
	}

	return;
}

function broadcast(pulse: PulsePower): void {
	const device = devices.broadcaster as Device;
	for (const target of device.targets)
		schedulePulse(device.name, target, pulse);
}

function receivePulse(
	sender: string,
	target: string,
	pulse: PulsePower,
): undefined | number {
	if (pulse === PulsePower.LOW && mainFeeders[target] === -1) {
		mainFeeders[target] = numButtonPresses;

		const result = tryFinish();
		if (result !== undefined) return result;
	}

	const device = devices[target];
	if (!device) return;

	switch (device.module) {
		case Module.BROADCASTER:
			broadcast(pulse);
			return;
		case Module.FLIPFLOP:
			flipflopReceivePulse(device, pulse);
			return;
		case Module.CONJUNCTION:
			conjunctionReceivePulse(device, sender, pulse);
			return;
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
