
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

/**
 * mapSelection re-maps selection from one dimension to another
 * @param {Object} selection selection object
 * @param {Object} dimension1 { width, height }
 * @param {Object} dimension2 { width, height }
 */
export function mapSelection(selection, dimension1, dimension2) {
  return {
    // ...selection,
    x: Math.floor(map(selection.x, 0, dimension1.width, 0, dimension2.width)),
    y: Math.floor(map(selection.y, 0, dimension1.height, 0, dimension2.height)),
    width: Math.floor(map(selection.width, 0, dimension1.width, 0, dimension2.width)),
    height: Math.floor(map(selection.height, 0, dimension1.height, 0, dimension2.height)),
  }
}