'use strict';

import faker from 'faker';

import SNS from '../../../src/events/SNS';
import Record from '../../../src/events/SNS/record';
import { OK, ERROR } from '../../../src/global';

const records = [{}];

const event = { Records: records };

const context = {}

const cb = jest.fn();

describe('SNS', () => {

  const sns = new SNS(event, context, cb);

  test('#records', () => {
    const expected = records.map(r => expect.any(Record));
    expect(sns.records).toEqual(expect.arrayContaining(expected));
  });

  test('#event', () => {
    expect(sns.event).toEqual(event);
  });

  test('#context', () => {
    expect(sns.context).toEqual(context);
  });

  describe('#each', () => {
    it('should raise implementation error', () => {
      try {
        sns.each()
      } catch (err) {
        expect(err).toEqual(expect.any(Error));
      }
    })
  });

  describe('#response', () => {
    describe('when execution was successful', () => {
      const cb = jest.fn();

      const sns = new SNS(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.word();
        sns.respond(OK, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(response));
      })
    });

    describe('when execution failed', () => {
      const cb = jest.fn();

      const sns = new SNS(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        sns.respond(ERROR, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
      })
    })
  });

  describe('#perform', () => {
    const each = jest.fn();

    const sns = new SNS(event, context, cb);

    sns.each = each;

    it('should call #each', () => {
      sns.perform();
      expect(each).toHaveBeenCalledTimes(records.length);
      expect(each).toHaveBeenLastCalledWith(expect.any(Record), expect.anything(), expect.anything());
    })
  });
});
