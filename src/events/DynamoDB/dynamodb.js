import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import Record from './record';

/**
 * Provides a simple interface for working with DynamoDB Stream events.
 *
 * @constructor DynamoDB
 *
 * @extends LambdaEvent
 *
 * @tutorial DynamoDB
 */
export default class extends LambdaEvent {
  /**
   * The map of records received by the event.
   *
   * @return {Array[Record]} array of Record objects
   */
  get records() {
    return this.event.Records.map(r => new Record(r));
  }

  /**
   * A function that is automatically invoked and passed each record that
   * the function has received from the associated DynamoDB stream.
   *
   * @param {Record} record - the record to perform an action with
   *
   * @return {Promise} a promise that should be resolved or rejected
   */
  each(record) {
    throw new Error('missing #each implementation');
  }

  /**
   * Executes the Lambda function, iterating over all the records
   * that have been received with #each.
   *
   * This method expects to receive an array of promises from each call to
   * #each.
   *
   * If all promises are resolved, the function will return successfully.
   * Therefore, ensure that any operations performed inside #each are
   * idempotent.
   *
   * @note This function is automatically called.
   *
   * @function DynamoDB#perform
   */
  perform() {
    const promises = this.records.map(this.each, this);
    Promise.all(promises)
      .then(() => { this.respond(OK); })
      .catch((err) => { this.respond(ERROR, err.toString()); });
  }
}
