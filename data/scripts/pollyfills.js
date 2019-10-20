/**
 * Number class pollyfills
 */

 /**
  * Round number to nearest precision value
  * @param {number} precision Precision (Integer)
  */
Number.prototype.round = function (precision) {
    const precisionExp = Math.pow(10, precision);
    return Math.round(this * precisionExp) / precisionExp;
}   