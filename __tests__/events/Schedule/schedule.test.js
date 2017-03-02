'use strict';

import faker from 'faker';

import Schedule, { wrap } from '../../../src/events/Schedule';
import { OK, ERROR } from '../../../src/global';

const event = {};

const context = {}

const cb = jest.fn();

describe('Schedule', () => {

  const schedule = new Schedule(event, context, cb);

  test('#event', () => {
    expect(schedule.event).toEqual(event);
  });

  test('#context', () => {
    expect(schedule.context).toEqual(context);
  });

  describe('#response', () => {
    describe('when execution was successful', () => {
      const cb = jest.fn();

      const schedule = new Schedule(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        schedule.respond(OK, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(null, response);
      })
    });

    describe('when execution failed', () => {
      const cb = jest.fn();

      const schedule = new Schedule(event, context, cb);

      it('should call the callback', () => {
        const response = faker.random.words();
        schedule.respond(ERROR, response)
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
      })
    })
  });

  describe('#perform', () => {
    it('should raise an error', () => {
      try {
        schedule.perform()
      } catch(err) {
        expect(err).toBeInstanceOf(Error);
      }
    })
  });
});

describe('#wrap', () => {
  const performer = jest.fn();

  class TestSchedule extends Schedule {
    perform(fn, ...args) {
      return fn(...args);
    }
  }

  test('it returns a function', () => {
    expect(wrap(TestSchedule, performer, 1, 2)).toEqual(expect.any(Function));
  })

  test('it calls perform', () => {
    wrap(TestSchedule, performer, 1, 2)(event, context, cb)
    expect(performer).toHaveBeenCalledWith(1, 2);
  });
})
