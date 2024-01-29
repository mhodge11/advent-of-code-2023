interface RuntimeTracker {
	start: () => void;
	stop: () => void;
	get: () => string;
}

function trim(time: number) {
	let trimmed = time.toFixed(3);

	if (!trimmed.includes(".") || !trimmed.endsWith("0")) return trimmed;

	while (trimmed.endsWith("0") && !trimmed.endsWith("."))
		trimmed = trimmed.slice(0, -1);

	if (trimmed.endsWith(".")) trimmed = trimmed.slice(0, -1);

	return trimmed;
}

export function runtimeTracker(): RuntimeTracker {
	let startTime: number | undefined;
	let endTime: number | undefined;

	return {
		start() {
			startTime = performance.now();
		},
		stop() {
			endTime = performance.now();
		},
		get() {
			if (!startTime) throw new Error("Runtime tracker has not been started");
			if (!endTime) throw new Error("Runtime tracker has not been stopped");

			const time = endTime - startTime;
			if (time < 1000) return `${trim(time)} ms`;
			return `${trim(time / 1000)} s`;
		},
	};
}
