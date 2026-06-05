/**
 * AsyncQueue — serializes async operations per key so that concurrent mutations
 * to the same entity type are executed one at a time, preventing race conditions.
 *
 * Usage:
 *   const queue = new AsyncQueue();
 *   await queue.enqueue("goals", () => goalsApi.update(id, data));
 */
export class AsyncQueue {
  private queues = new Map<string, Promise<unknown>>();

  /**
   * Enqueue an async operation under `key`. Operations with the same key are
   * chained so each one waits for the previous to finish before starting.
   * Operations with different keys run concurrently.
   */
  enqueue<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const previous = this.queues.get(key) ?? Promise.resolve();

    const next = previous.then(fn, fn) as Promise<T>;

    // Store a silenced version so a rejection in one operation doesn't break
    // the chain for subsequent operations.
    this.queues.set(
      key,
      next.catch(() => undefined)
    );

    return next;
  }

  /** Returns true if there is a pending operation for the given key. */
  isRunning(key: string): boolean {
    return this.queues.has(key);
  }

  /** Clear the queue for a key (use with caution — only after confirmed idle). */
  clear(key: string): void {
    this.queues.delete(key);
  }
}
