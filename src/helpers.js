
/**
 * map re-maps a number from one range to another.
 * Shamelessly stolen from arduino.
 * 
 * @param {Number} x value
 * @param {Number} in_min lower bound of value's range
 * @param {Number} in_max upper bound of value's range
 * @param {Number} out_min lower bound of target range
 * @param {Number} out_max upper bound of target length
 */
export function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}