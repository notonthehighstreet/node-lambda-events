import LambdaEvent from '../lambdaEvent';
import Response from './response';

/**
 * Provides a simple interface for working with Custom Cloudformation Resource events.
 * @constructor Cloudformation
 * @extends LambdaEvent
 * @param {object} event - The event being received from AWS Lambda
 * @param {string} context - The context of the event being received
 * @param {function} cb - The callback function passed through from Lambda
 * @see {@link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html|Custom Cloudformation Resources}
 * @tutorial Cloudformation
 */
export default class extends LambdaEvent {
  constructor(event, context, cb) {
    super();
    /** @member {Object} */
    this.event = event;
    this.context = context;
    this.response = new Response(event, cb);
  }

  /**
   * Get the dot's width.
   * @return {number} The dot's width, in pixels.
   */
  perform() {
    this[this.type]();
  }

  get properties() {
    delete this.event.ResourceProperties.ServiceToken;
    return this.event.ResourceProperties;
  }

  get id() {
    return this.event.PhysicalResourceId;
  }

  get type() {
    switch (this.event.RequestType) {
      default:
        return this.event.RequestType.toLowerCase();
    }
  }
}
