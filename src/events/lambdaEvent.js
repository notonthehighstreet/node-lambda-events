import { OK } from '../global';

/**
 * A Lambda Callback signals to AWS Lambda that the function has completed
 * either successfully or otherwise. It can contain a result body (as a string)
 * or throw an [Error object]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}.
 *
 * @callback lambdaCallback
 * @param {null|Error} res - The result of the function being called
 * @param {string} [body=""] - A string response payload
 */

/**
 * This default base class allows all extending events to inherit common
 * functionality.

 * @constructor LambdaEvent
 */
export default class {
  /**
   * A new instance of LambdaEvent
   *
   * @param {object} event - The event being received from AWS Lambda. The content of this object is
   *  determined greatly by the stream it has originated from.
   * @param {string} event.Records - The records being processed by this Lambda function.
   * @param {object} context - The context of the event being received
   *  [See here]{@link http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html}
   * @param {lambdaCallback} cb - The callback function passed through from Lambda
   *
   * @see {@link http://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-ddb-update|Sample DynamoDB Event}
   */
  constructor(event, context, cb) {
    /**
     * The raw event received by Lambda
     * @member {Object} LambdaEvent#event
     */
    this.event = event;
    /**
     * The raw context object received by Lambda
     * @member {Object} LambdaEvent#context
     */
    this.context = context;
    /**
     * The response object allowing any extending class
     * to respond to Cloudformation.
     * @member {Function} LambdaEvent#cb
     */
    this.cb = cb;
  }

  /**
   * A Class-wrapper, allowing any class to handle and process events
   * in a similar manner, without making assumptions on how the function
   * will be executed.
   *
   * @function {Function} wrap
   * @memberof LambdaEvent
   * @static
   *
   * @param {Class} Req - the class that will handle the lambda event
   * @param {...*} params - Any accompanying params that will be passed into
   *  the extending classes perform method.
   */
  static wrap(Req, ...params) {
    return (ev, ctx, fn) => { new Req(ev, ctx, fn).perform(...params); };
  }

  respond(status = OK, body = '') {
    if (status === OK) {
      return this.cb(null, body);
    } else {
      return this.cb(new Error(`[500] "${body}"`));
    }
  }
}
