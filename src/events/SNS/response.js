import { OK } from '../../global';

/**
 * Provides a simple interface for responding to SNS Lambda Events
 *
 * @constructor Response
 *
 * @module SNS
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
