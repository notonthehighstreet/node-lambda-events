'use strict';

import faker from 'faker';

import Record from '../../../src/events/DynamoDB/record';
import { CREATE, UPDATE, DELETE } from '../../../src/events/DynamoDB/constants';

import { marshalItem, unmarshalItem } from 'dynamodb-marshaler';

describe('DynamoDB.Record', () => {
  const keys = {
    Id: faker.random.uuid(),
    Created: new Date().getTime()
  };

  const newImage = Object.assign({}, keys, {
    Message: faker.random.words()
  })

  const oldImage = Object.assign({}, keys, {
    Message: faker.random.words()
  })

  const payload = {
    eventID: faker.random.number().toString(),
    eventVersion: "1.0",
    dynamodb: {
      Keys: marshalItem(keys),
      NewImage: marshalItem(newImage),
      OldImage: marshalItem(oldImage),
      StreamViewType: faker.random.arrayElement(["NEW_AND_OLD_IMAGES"]),
      SequenceNumber: faker.random.number().toString(),
      SizeBytes: faker.random.number()
    },
    awsRegion: faker.random.arrayElement(['us-east-1', 'us-east-2', 'eu-west-1', 'eu-west-2']),
    eventName: faker.random.arrayElement(["INSERT", "MODIFY", "REMOVE"]),
    eventSourceArn: `arn:aws:dynamodb:us-west-2:TABLE/${faker.random.uuid()}`,
    eventSource: "aws:dynamodb"
  };

  const record = new Record(payload);

  describe('#record', () => {
    it('should match', () => {
      expect(record.record).toEqual(payload);
    })
  });

  describe('#type', () => {
    describe('when INSERT', () => {
      const payload = Object.assign({}, payload, {
        eventName: "INSERT"
      });

      const record = new Record(payload);

      it('should equal create', () => {
        expect(record.type).toEqual(CREATE);
      })
    })

    describe('when MODIFY', () => {
      const payload = Object.assign({}, payload, {
        eventName: "MODIFY"
      });

      const record = new Record(payload);

      it('should equal create', () => {
        expect(record.type).toEqual(UPDATE);
      })
    })

    describe('when REMOVE', () => {
      const payload = Object.assign({}, payload, {
        eventName: "REMOVE"
      });

      const record = new Record(payload);

      it('should equal create', () => {
        expect(record.type).toEqual(DELETE);
      })
    })
  });

  describe('#keys', () => {
    it('should be an object', () => {
      expect(record.keys).toBeInstanceOf(Object);
    })

    it('should be unmarshaled', () => {
      expect(record.keys).toEqual(expect.objectContaining(keys));
    });
  });

  describe('#newImage', () => {
    describe('when unset', () => {
      fit('should return an empty object', () => {
        const rec = new Record({ dynamodb: { NewImage: null } });
        expect(rec.newImage).toBeInstanceOf(Object);
      })
    });

    it('should be an object', () => {
      expect(record.newImage).toBeInstanceOf(Object);
    })

    it('should be unmarshaled', () => {
      expect(record.newImage).toEqual(expect.objectContaining(newImage));
    });
  });

  describe('#oldImage', () => {
    describe('when unset', () => {
      fit('should return an empty object', () => {
        const rec = new Record({ dynamodb: { OewImage: null } });
        expect(rec.oldImage).toBeInstanceOf(Object);
      })
    });

    it('should be an object', () => {
      expect(record.oldImage).toBeInstanceOf(Object);
    })

    it('should be unmarshaled', () => {
      expect(record.oldImage).toEqual(expect.objectContaining(oldImage));
    });
  });

  describe('#data', () => {
    it('should be an object', () => {
      expect(record.data).toBeInstanceOf(Object);
    })

    it('should be unmarshaled', () => {
      expect(record.data).toEqual(payload.dynamodb);
    });
  });
})
