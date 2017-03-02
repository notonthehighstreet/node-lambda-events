'use strict';

import faker from 'faker';

import Record from '../../../src/events/CognitoEvent/record';

describe('CognitoEvent.Record', () => {
  const key = faker.random.word();

  const payload = {
    newValue: faker.random.word(),
    oldValue: faker.random.word(),
    op: faker.random.arrayElement(['replace', 'remove']),
  };

  const record = new Record(key, payload);

  describe('#body', () => {
    it('should match', () => {
      expect(record.body).toEqual(payload);
    })
  });

  describe('#type', () => {
    it('should be the correct value', () => {
      expect(record.type).toEqual(payload.op);
    });
  });

  describe('#key', () => {
    it('should be the correct value', () => {
      expect(record.key).toEqual(key);
    });
  });

  describe('#oldValue', () => {
    it('should be the correct value', () => {
      expect(record.oldValue).toEqual(payload.oldValue);
    });
  });

  describe('#newValue', () => {
    it('should be the correct value', () => {
      expect(record.newValue).toEqual(payload.newValue);
    });
  });
})
