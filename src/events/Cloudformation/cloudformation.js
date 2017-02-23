import LambdaEvent from '../lambdaEvent';
import Response from './response';

/**
 * Provides a simple interface for working with Custom Cloudformation Resource events.
 *
 * @constructor Cloudformation
 *
 * @extends LambdaEvent
 *
 * @param {object} event - The event being received from AWS Lambda. The content of this object is
 *  determined greatly by the resource it is being invoked against.
 *  [See here]{@link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html}
 * @param {string} event.RequestType - The type of Cloudformation request
 * @param {string} event.ResponseURL - The response URL identifies a pre-signed S3 bucket
 * @param {string} event.StackId - The Amazon Resource Name (ARN) that identifies the stack
 * @param {string} event.RequestId - A unique ID for the request
 * @param {string} event.ResourceType - The custom named resource type as defined in the cloudformation
 * @param {string} event.LogicalResourceId - The template developer-chosen name
 *  (logical ID) of the custom resource in the AWS CloudFormation template
 * @param {string} [event.PhysicalResourceId=null] - An ID of the associated
 *  AWS resource created by the custom resource. Null on Create
 * @param {object} event.ResourceProperties - The properties defined by the custom resource definition
 * @param {object} [event.OldResourceProperties=null] - Used only for Update
 *  requests. Contains the resource properties that were declared previous to the update request
 * @param {object} context - The context of the event being received
 *  [See here]{@link http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html}
 * @param {lambdaCallback} cb - The callback function passed through from Lambda
 *
 * @see {@link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html|Custom Cloudformation Resources}
 *
 * @tutorial Cloudformation
 */
export default class extends LambdaEvent {
  constructor(event, context, cb) {
    super();
    /**
     * The raw event received by Lambda
     * @member {Object} Cloudformation#event
     */
    this.event = event;
    /**
     * The raw context object received by Lambda
     * @member {Object} Cloudformation#context
     */
    this.context = context;
    /**
     * The response object allowing any extending class
     * to respond to Cloudformation.
     * @member {Response} Cloudformation#response
     */
    this.response = new Response(event, cb);
  }

  /**
   * Executes the action determined by the request type that
   * Cloudformation has invoked this function with.
   *
   * @note This function is automatically called.
   *
   * @function Cloudformation#perform
   */
  perform() {
    this[this.type]();
  }

  /**
   * Returns the properties for the custom Cloudformation request without
   * the accompanying ServiceToken.
   *
   * @member {Object} Cloudformation#properties
   */
  get properties() {
    delete this.event.ResourceProperties.ServiceToken;
    return this.event.ResourceProperties;
  }

  /**
   * Returns the PhysicalResourceId that is associated with the custom
   * resource that this lambda function controls. For Create requests, this
   * will return null.
   *
   * @member {null|String} Cloudformation#id
   */
  get id() {
    return this.event.PhysicalResourceId;
  }

  /**
   * Return the type of request. Typically this will member will return "create",
   * "update" or "delete". This member is used to determine which action the
   * lambda function should perform.
   *
   * @member {String} Cloudformation#type
   * @see Cloudformation#perform
   */
  get type() {
    switch (this.event.RequestType) {
      default:
        return this.event.RequestType.toLowerCase();
    }
  }
}
