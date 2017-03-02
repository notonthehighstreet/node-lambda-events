'use strict';

import faker from 'faker';

import Record from '../../../src/events/CognitoStream/record';

describe('CognitoStream.Record', () => {
  const payload = {
    key: faker.random.word(),
    value: faker.random.number().toString(),
    syncCount: faker.random.number(),
    lastModifiedDate: new Date().getTime(),
    deviceLastModifiedDate: new Date().getTime(),
    op: faker.random.arrayElement(['replace', 'remove']),
  };

  const record = new Record(payload);

  describe('#record', () => {
    it('should match', () => {
      expect(record.record).toEqual(payload);
    })
  });

  describe('#type', () => {
    it('should be the correct value', () => {
      expect(record.type).toEqual(payload.op);
    });
  });

  describe('#key', () => {
    it('should be the correct value', () => {
      expect(record.key).toEqual(payload.key);
    });
  });

  describe('#value', () => {
    it('should be the correct value', () => {
      expect(record.value).toEqual(payload.value);
    });
  });
})
