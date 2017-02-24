import { OK } from '../../global';

/**
 * Provides a simple interface for responding to DynamoDB Lambda Events
 *
 * @constructor Response
 *
 * @module DynamoDB
 */
export default class {
  constructor(_, cb) {
    this.cb = cb;
  }

  respond(status = OK, body = '') {
    if (status === OK) {
      return this.cb(null, body);
    } else {
      return this.cb(new Error(`[500] "${body}"`));
    }
  }
}
