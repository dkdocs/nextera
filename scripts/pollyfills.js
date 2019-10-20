/**
 * Number class pollyfills
 */
Number.prototype.round = function (precision) {
    const precisionExp = Math.pow(10, precision);
    return Math.round(this * precisionExp) / precisionExp;
}