import { LRUCache } from "lru-cache";

type CacheValue = Record<string, unknown>;

const cache = new LRUCache<string, CacheValue>({
	max: 500,
	ttl: 1000 * 60 * 5,
});

export type CacheOptions = {
	ttl?: number;
	key: string;
};

export async function getCachedData<T extends CacheValue>(
	options: CacheOptions,
	fetchFn: () => Promise<T>,
): Promise<T> {
	const { key, ttl } = options;

	const cachedData = cache.get(key);
	if (cachedData) {
		return cachedData as T;
	}

	const data = await fetchFn();
	cache.set(key, data, { ttl });
	return data;
}

export function invalidateCache(key: string) {
	cache.delete(key);
}

export function invalidateCacheByPrefix(prefix: string) {
	for (const key of cache.keys()) {
		if (key.startsWith(prefix)) {
			cache.delete(key);
		}
	}
}

export function generateCacheKey(
	prefix: string,
	params: Record<string, string | number>,
) {
	const sortedParams = Object.entries(params)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => `${key}:${value}`)
		.join("|");
	return `${prefix}:${sortedParams}`;
}
