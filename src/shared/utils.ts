/**
 * When running in browsers supporting performance.now(), or in Node.js, this function will
 * return the time elapsed, in milliseconds, since the time origin. If running
 * in environments that don't support performance.now() it will use Date.now();
 * @hidden
 * @internal
 * @returns {number} - The returned value represents the time elapsed, in milliseconds, since the
 * time origin or since the UNIX epoch.
 */
export let now: () => number;
try {
  if (typeof window !== 'undefined') {
    now = performance.now;
  } else {
    const { performance } = require('perf_hooks');
    now = performance.now;
  }
} catch {
  now = Date.now;
}

/**
 * This function will return `num` if it is between or equal to
 * `min` and `max`. If it isn't it will return `max` if num is higher than `max`
 * or it will return `min` if num is lower than `min`.
 *
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

/**
 * A function that return a random whole number between
 * `min` and `max`.
 * @hidden
 * @internal
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
};

/**
 * A function that returns a random element from an `array`
 *
 * @template T
 * @param {(Array<T> | ReadonlyArray<T>)} array
 * @returns {T}
 */
const getRandomElementFrom = <T>(array: Array<T> | ReadonlyArray<T>): T => {
  const index = getRandomIntInclusive(0, array.length - 1);
  return array[index];
};

/**
 * A function that removes and returns a random element from an `arrray`.
 * @hidden
 * @internal
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export const spliceRandom = <T>(array: T[]): T => {
  const index = getRandomIntInclusive(0, array.length - 1);
  return array.splice(index, 1)[0];
};

/**
 * A function to make looping for a specific amount of time
 * or a specific amount of loops, easier. Simply return `true`
 * to break out of the loop.
 *
 * ### Example
 * ```javascript
 * // Loop for 2 seconds
 * loopFor(2).seconds(() => {
 *   // Things to do in a loop.
 * });
 *
 * // Loop for 50 turns
 * loopFor(50).turns(() => {
 *   // Things to do in a loop.
 *   if (someCondition) {
 *     // break out of loop
 *     return true;
 *   }
 * });
 * ```
 * @hidden
 * @internal
 * @param {number} time
 * @returns
 */
export const loopFor = (time: number) => {
  return {
    milliseconds: (callback: (remaining: number) => boolean | void) => {
      const start = now();
      while (now() - start < time) {
        if (callback(time - (now() - start))) break;
      }
    },
    seconds: (callback: () => boolean | void) => {
      const start = now();
      const t = time * 1000;
      while (now() - start < t) {
        if (callback()) break;
      }
    },
    turns: (callback: () => boolean | void) => {
      while (time > 0) {
        if (callback()) break;
        time--;
      }
    },
  };
};

/**
 * Function to get the average of a numbers array
 * @hidden
 * @internal
 * @param {number[]} arr
 */
export const arrAvg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

export const radiansFrom = (degrees: number): number => degrees * Math.PI / 180;

export const degreesFrom = (radians: number): number => radians * 180 / Math.PI;
