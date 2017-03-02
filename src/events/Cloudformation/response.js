import request from 'request';
import Joi from 'joi';

import { SUCCESS, FAILED } from './constants';
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
  constructor({ ResponseURL, RequestId, LogicalResourceId, StackId }, cb) {
    this.ResponseURL = ResponseURL;
    this.RequestId = RequestId;
    this.LogicalResourceId = LogicalResourceId;
    this.StackId = StackId;
    this.cb = cb;
  }

  async respond(...args) {
    try {
      const body = this.payload(...args);
      const { validated } = await this.validate(body);
      await this.respondToCloudformation({ body });
      return this.cb(null, body);
    } catch (err) {
      return this.cb(new Error(err.toString()));
    }
  }

  respondToCloudformation({ body = {} }) {
    const parsed = JSON.stringify(body);
    const payload = {
      url: this.ResponseURL,
      method: 'PUT',
      port: 443,
      body: parsed,
      headers: {
        'content-type': '',
        'content-length': parsed.length,
      },
    };
    return new Promise((resolve, reject) => {
      request(payload, (err, resp, body) => {
        return err ? reject(err) : resolve(body);
      })
    });
  }

  validate(obj) {
    return new Promise((resolve, reject) => {
      Joi.validate(obj, Schema, (err, val) => {
        return err ? reject(err) : resolve(val);
      });
    })
  }

  payload(status = OK, { reason, data = {}, id }) {
    const { StackId, RequestId, LogicalResourceId } = this;
    return {
      Status: (status === OK ? SUCCESS : FAILED),
      Reason: reason,
      PhysicalResourceId: id,
      Data: data,
      StackId,
      RequestId,
      LogicalResourceId,
    };
  }
}

export default Response;
