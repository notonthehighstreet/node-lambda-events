'use strict';

import faker from 'faker';

import DynamoDB, { wrap } from '../../../src/events/DynamoDB';
import Record from '../../../src/events/DynamoDB/record';
import { OK, ERROR } from '../../../src/global';

const records = [{}];

const event = { Records: records };

const context = {}

const cb = jest.fn();

describe('DynamoDB', () => {

  const dynamodb = new DynamoDB(event, context, cb);

  test('#event', () => {
    expect(dynamodb.event).toEqual(event);
  });

  test('#records', () => {
    const expected = records.map(r => expect.any(Record));
    expect(dynamodb.records).toEqual(expect.arrayContaining(expected));
  });

  test('#context', () => {
    expect(dynamodb.context).toEqual(context);
  });

  describe('#each', () => {
    it('should raise implementation error', () => {
      try {
        dynamodb.each()
      } catch (err) {
        expect(err).toEqual(expect.any(Error));
      }
    })
  });

  describe('#response', () => {
    describe('when execution was successful', () => {
      const cb = jest.fn();

      const dynamodb = new DynamoDB(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        dynamodb.response.respond(OK, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(response));
      })
    });

    describe('when execution failed', () => {
      const cb = jest.fn();

      const dynamodb = new DynamoDB(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        dynamodb.response.respond(ERROR, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
      })
    })
  });

  describe('#perform', () => {
    const each = jest.fn();

    const dynamodb = new DynamoDB(event, context, cb);

    dynamodb.each = each;

    it('should call #each', () => {
      dynamodb.perform();
      expect(each).toHaveBeenCalledTimes(records.length);
      expect(each).toHaveBeenLastCalledWith(expect.any(Record), expect.anything(), expect.anything());
    })
  });
});

describe('#wrap', () => {
  const performer = jest.fn();

  class TestDynamoDB extends DynamoDB {
    perform(fn, ...args) {
      return fn(...args);
    }
  }

  test('it returns a function', () => {
    expect(DynamoDB.wrap(TestDynamoDB, performer, 1, 2)).toEqual(expect.any(Function));
  })

  test('it calls perform', () => {
    DynamoDB.wrap(TestDynamoDB, performer, 1, 2)(event, context, cb)
    expect(performer).toHaveBeenCalledWith(1, 2);
  });
})
