import type { GenericFunction } from "types/GenericFunction.ts";

const defaultResolver = (...args: unknown[]): string => JSON.stringify(args);

export function memoize<
	F extends GenericFunction<F>,
	Cache extends Map<string, [ReturnType<F>, number]>,
>(
	func: F,
	options: {
		resolver?: (...args: Parameters<F>) => string;
		ttl?: number;
	} = {},
): F & { cache: Cache } {
	if (typeof func !== "function") throw new TypeError("Expected a function");

	const resolver = options.resolver ?? defaultResolver;
	const ttl = options.ttl;
	const cache = new Map() as Cache;

	const memoizedFunc = function (
		this: unknown,
		...args: Parameters<F>
	): ReturnType<F> {
		const key = resolver(...args);

		if (cache.has(key)) {
			const [cacheResult, cacheTime] = cache.get(key) as [
				ReturnType<F>,
				number,
			];

			if (ttl === undefined || Date.now() - cacheTime < ttl) return cacheResult;

			cache.delete(key);
		}

		const result = func.apply(this, args);

		cache.set(key, [result, Date.now()]);

		return result;
	};

	memoizedFunc.cache = cache;

	return memoizedFunc as F & { cache: Cache };
}
