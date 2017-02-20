'use strict';

import Joi from 'joi';
import { Schema } from '../../../src/events/Cloudformation/schema';
import { SUCCESS, FAILED } from '../../../src/events/Cloudformation/constants';

describe('#Schema', () => {
  beforeEach(() => { expect.assertions(1); });

  let stackId = "arn:aws:cloudformation:us-west-2:EXAMPLE/stack-name/guid";

  let requestId = "41924891849128491849";

  let logicalResourceId = "MyTestResource";

  const payload = {
    Status: "OK",
    Reason: "...",
    PhysicalResourceId: "..",
    StackId: stackId,
    RequestId: requestId,
    LogicalResourceId: logicalResourceId,
    Data: {},
  };

  it('returns a object', () => {
    expect(Schema).toBeInstanceOf(Object);
  });

  Object.keys(payload).forEach((key) => {
    it(`requires #${key}`, () => {
      const test = Object.assign({}, payload, { [key]: null });
      Joi.validate(test, Schema, (err, vals) => {
        expect(err.toString()).toMatch(/ValidationError/);
      })
    })
  }, this);

  describe('when Status is OK', () => {
    it('does not require Reason', async () => {
      let test = Object.assign({}, payload);
      delete test.Reason;
      Joi.validate(test, Schema, (err, vals) => {
        expect(vals).toEqual(test);
      });
    })

    it('requires PhysicalResourceId', async () => {
      let test = Object.assign({}, payload);
      delete test.PhysicalResourceId;
      Joi.validate(test, Schema, (err, vals) => {
        expect(err.toString()).toMatch(/ValidationError/);
      });
    });
  });

  describe('when Status is FAILED', () => {
    it('does require Reason', async () => {
      let test = Object.assign({}, payload, { Status: FAILED });
      delete test.Reason;
      Joi.validate(test, Schema, (err, vals) => {
        expect(err.toString()).toMatch(/ValidationError/);
      });
    });

    it('does not require PhysicalResourceId', async () => {
      let test = Object.assign({}, payload, { Status: "FAILED" });
      delete test.PhysicalResourceId;
      Joi.validate(test, Schema, (err, vals) => {
        expect(vals).toEqual(test);
      });
    });
  });
});
