import { useSyncExternalStore } from 'react';

/**
 * Tiny observable store for in-memory app state (until each module is backed by the API).
 * `use()` re-renders subscribers whenever `set()` is called.
 */
export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const get = () => state;
  const set = (next: T | ((prev: T) => T)) => {
    state = typeof next === 'function' ? (next as (prev: T) => T)(state) : next;
    listeners.forEach((l) => l());
  };
  const use = () => useSyncExternalStore(subscribe, get, get);
  return { get, set, subscribe, use };
}
