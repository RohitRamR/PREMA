// A tiny external store: one value, a React hook to read it, and a setter
// that re-renders every subscriber. Every app store (profile, chats, safety,
// PREMA Date) is built on this, so when the backend lands only each store's
// read/write functions need to change.
import { useSyncExternalStore } from 'react';

export type Store<T> = {
  /** Current value (outside React). */
  get: () => T;
  /** Replace the value, or derive it from the previous one, and notify subscribers. */
  set: (next: T | ((prev: T) => T)) => void;
  /** Listen for changes; returns an unsubscribe function. */
  subscribe: (listener: () => void) => () => void;
  /** React hook: the current value, re-rendering on every change. */
  use: () => T;
};

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();

  const get = () => value;
  const set = (next: T | ((prev: T) => T)) => {
    value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next;
    listeners.forEach((l) => l());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const use = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, subscribe, use };
}
