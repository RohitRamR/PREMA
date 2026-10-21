// Run: npm test (from apps/mobile)
import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../create-store';

describe('createStore', () => {
  it('returns the initial value', () => {
    expect(createStore({ n: 1 }).get()).toEqual({ n: 1 });
  });

  it('replaces the value', () => {
    const s = createStore(1);
    s.set(2);
    expect(s.get()).toBe(2);
  });

  it('derives the next value from the previous one', () => {
    const s = createStore({ n: 1 });
    s.set((p) => ({ n: p.n + 1 }));
    expect(s.get()).toEqual({ n: 2 });
  });

  it('notifies every subscriber on each change', () => {
    const s = createStore(0);
    const a = vi.fn();
    const b = vi.fn();
    s.subscribe(a);
    s.subscribe(b);
    s.set(1);
    s.set(2);
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(2);
  });

  it('stops notifying after unsubscribe', () => {
    const s = createStore(0);
    const l = vi.fn();
    const off = s.subscribe(l);
    off();
    s.set(1);
    expect(l).not.toHaveBeenCalled();
  });

  it('keeps stores independent', () => {
    const a = createStore('a');
    const b = createStore('b');
    a.set('x');
    expect(b.get()).toBe('b');
  });
});
