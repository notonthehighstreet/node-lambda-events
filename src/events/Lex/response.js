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
    this.sessionAttributes = sessionAttributes;
    this.cb = cb;
  }

  async respond(...args) {
    try {
      const body = this.payload(...args);
      const values = await this.validate(body);
      return this.cb(null, values);
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

  payload(status = OK, dialogAction = {}, attrs = {}) {
    let { sessionAttributes } = this;
    sessionAttributes = Object.assign(this.sessionAttributes, attrs);
    if (status !== OK) {
      return {
        sessionAttributes,
        dialogAction: this.error,
      };
    } else {
      return {
        sessionAttributes,
        dialogAction,
      };
    }
  }

  get error() {
    return {
      type: 'Close',
      fulfillmentState: 'Failed',
      message: {
        content: 'Sorry! There was an internal error.'
      }
    }
  }
}

export default Response;
