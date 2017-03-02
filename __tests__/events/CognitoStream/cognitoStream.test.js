'use strict';

import faker from 'faker';

import CognitoStream from '../../../src/events/CognitoStream';
import Record from '../../../src/events/CognitoStream/record';
import { OK, ERROR } from '../../../src/global';

const records = [{}];

const event = {
  identityPoolId: faker.random.uuid(),
  identityId: faker.random.uuid(),
  operation: faker.random.arrayElement(['replace', 'remove']),
  lastModifiedDate: new Date().getTime(),
  kinesisSyncRecordsURL: faker.internet.url(),
  kinesisSyncRecords: records,
  payloadType: 'Inline',
};

const context = {}

const cb = jest.fn();

describe('CognitoStream', () => {

  const cognito = new CognitoStream(event, context, cb);

  test('#event', () => {
    expect(cognito.event).toEqual(event);
  });

  test('#context', () => {
    expect(cognito.context).toEqual(context);
  });

  describe('#each', () => {
    it('should raise implementation error', () => {
      try {
        cognito.each()
      } catch (err) {
        expect(err).toEqual(expect.any(Error));
      }
    })
  });

  describe('#respond', () => {
    describe('when execution was successful', () => {
      const cb = jest.fn();

      const cognito = new CognitoStream(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        cognito.respond(OK, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(null, response);
      })
    });

    describe('when execution failed', () => {
      const cb = jest.fn();

      const cognito = new CognitoStream(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        cognito.respond(ERROR, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
      })
    })
  });

  describe('#perform', () => {
    describe('when records are inline', () => {
      const each = jest.fn();

      const cognito = new CognitoStream(event, context, cb);

      cognito.each = each;

      it('should call #each', async () => {
        await cognito.perform();
        expect(each).toHaveBeenCalledTimes(records.length);
        expect(each).toHaveBeenLastCalledWith(expect.any(Record), expect.anything(), expect.anything());
      })
    });

    describe('when records are remote', () => {
      const remoteRecords = JSON.stringify(records);

      beforeAll(() => {
        let request = require('request')
        request.__setErr(false);
        request.__setResp({})
        request.__setBody(remoteRecords);
      });

      afterAll(() => {
        jest.unmock('request');
      });

      const remoteEvent = Object.assign({}, event, {
        payloadType: 'S3Url',
      });

      it('calls #fetch', async () => {
        const cognito = new CognitoStream(remoteEvent, context, cb);
        cognito.fetch = jest.fn();
        await cognito.load();
        expect(cognito.fetch).toHaveBeenCalledTimes(1);
      })
    });
  });
});
