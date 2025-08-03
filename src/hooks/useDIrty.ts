import { useMemo } from 'react';

/**
 * Compares two objects (or primitives) by JSON-stringify to tell if they've diverged.
 * @param initial  The “original” value
 * @param current  The “live” value (e.g. your formData)
 * @returns true if current !== initial
 */
export function useDirty<T>(initial: T, current: T): boolean {
  return useMemo(
    () => JSON.stringify(initial) !== JSON.stringify(current),
    [initial, current]
  );
}
