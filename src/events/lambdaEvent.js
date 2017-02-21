/**
 * Lambda Events
 * @constructor LambdaEvent
 */
export default class {
  /**
   * Convert a string containing two comma-separated numbers into a point.
   * @return {Function} A Point object.
   */
  static wrap(Req, ...params) {
    return (ev, ctx, fn) => { new Req(ev, ctx, fn).perform(...params); };
  }
}
