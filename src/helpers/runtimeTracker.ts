interface RuntimeTracker {
	start: () => void;
	stop: () => void;
	get: () => string;
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
			if (time < 1000) return `${time.toFixed(3)} ms`;
			return `${(time / 1000).toFixed(3)} s`;
		},
	};
}
