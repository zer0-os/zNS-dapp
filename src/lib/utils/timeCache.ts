

export interface TimeCache<T> {
  exists(key: string): boolean,
  get(key: string): T,
  put(key: string, value: T): void
  clear(): void;
  clearKey(key: string): void;
}

interface CacheEntry<T> {
  value: T,
  time: number
}

interface Cache<T> {
  [key: string]: CacheEntry<T> | undefined;
}

export function createTimeCache<T>(timeout: number): TimeCache<T> {
  let cache: Cache<T> = {};

  const getCacheEntry = (key: string): CacheEntry<T> | undefined => {
    return cache[key];
  }

  const exists = (key: string): boolean => {
    const entry = getCacheEntry(key);
    if (!entry) {
      return false;
    }

    const now = Date.now();
    const expired = now > entry.time + timeout;

    return !expired;
  }

  const get = (key: string): T => {
    const entry = getCacheEntry(key);
    if (!entry) {
      throw Error(`no cache entry for ${key}`);
    }

    return entry.value;
  }

  const put = (key: string, value: T): void => {
    const now = Date.now();

    cache[key] = {
      time: now,
      value
    }
  }

  const clear = () => {
    cache = {};
  }

  const clearKey = (key: string) => {
    cache[key] = undefined;
  }

  return {
    exists,
    get,
    put,
    clear,
    clearKey
  }
}
