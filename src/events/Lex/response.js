import Joi from 'joi';

import { OK } from '../../global';
import { Schema } from './schema';

/**
 * Provides a simple interface for working with Custom Cloudformation Resource events.
 *
 * @constructor Response
 *
 * @module Cloudformation
 */
class Response {
  constructor({ sessionAttributes }, cb) {
    this.sessionAttribtues = sessionAttributes;
    this.cb = cb;
  }

  async respond(...args) {
    try {
      const body = this.payload(...args);
      const { validated } = await this.validate(body);
      return this.cb(null, body);
    } catch (err) {
      return this.cb(new Error(err.toString()));
    }
  }

  validate(obj) {
    return new Promise((resolve, reject) => {
      Joi.validate(obj, Schema, (err, val) => {
        return err ? reject(err) : resolve(val);
      });
    })
  }

  payload(status = OK, dialogAction, attrs = {}) {
    const sessionAttributes = Object.assign(this.sessionAttributes, attrs);
    if (status !== OK) {
      return { sessionAttributes, dialogAction: this.error };
    } else {
      return { sessionAttributes, dialogAction };
    }
  }

  get error() {
    return {
      type: 'Close',
      fulfillmentState: 'Failed',
    }
  }
}

export default Response;
