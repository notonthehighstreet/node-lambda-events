'use strict';

import faker from 'faker';

import CognitoEvent from '../../../src/events/CognitoEvent';
import Record from '../../../src/events/CognitoEvent/record';
import { OK, ERROR } from '../../../src/global';

const records = [{}];

const event = {
  datasetName: faker.random.word(),
  eventType: "SyncTrigger",
  region: faker.random.arrayElement(["us-east-1", "us-east-2"]),
  identityId: faker.random.uuid(),
  datasetRecords: {
    [faker.random.word()]: {
      newValue: faker.random.word(),
      oldValue: faker.random.arrayElement(["", null, false]),
      op: "replace"
    },
    [faker.random.word()]: {
      newValue: faker.random.word(),
      oldValue: faker.random.word(),
      op: "replace"
    }
  },
  identityPoolId: faker.random.uuid(),
  version: 2
};

const context = {}

const cb = jest.fn();

describe('CognitoEvent', () => {

  const cognito = new CognitoEvent(event, context, cb);

  test('#event', () => {
    expect(cognito.event).toEqual(event);
  });

  test('#context', () => {
    expect(cognito.context).toEqual(context);
  });

  test('#dataset', () => {
    expect(cognito.dataset).toEqual(event.datasetName);
  });

  test('#identity', () => {
    expect(cognito.identity).toEqual(event.identityId);
  });

  describe('#records', () => {
    it('should be an object', () => {
      expect(cognito.records).toBeInstanceOf(Object);
    });

    it('should contain record objects', () => {
      expect(Object.values(cognito.records)[0]).toBeInstanceOf(Record);
    });
  });

  describe('#respond', () => {
    describe('when execution was successful', () => {
      const cb = jest.fn();

      const cognito = new CognitoEvent(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        cognito.respond(OK, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(null, response);
      })
    });

    describe('when execution failed', () => {
      const cb = jest.fn();

      const cognito = new CognitoEvent(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        cognito.respond(ERROR, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
      })
    })
  });

  describe('#perform', () => {
    const cb = jest.fn();

    const cognito = new CognitoEvent(event, context, cb);

    cognito.perform = jest.fn(() => {
      cognito.respond(OK, event);
    })

    it('should return a valid body', async () => {
      await cognito.perform();
      expect(cb).toHaveBeenLastCalledWith(null, expect.objectContaining({
        datasetName: expect.any(String),
        eventType: expect.any(String),
        region: expect.any(String),
        identityId: expect.any(String),
        datasetRecords: expect.any(Object),
        identityPoolId: expect.any(String),
        version: expect.any(Number),
      }));
    })
  });
});
