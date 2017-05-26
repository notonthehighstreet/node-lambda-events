'use strict';

import faker from 'faker';

import Record from '../../../src/events/SNS/record';

describe('SNS.Record', () => {
  const message = {
    [faker.random.word()]: faker.random.number(),
  };

  const payload = {
    EventVersion: "1.0",
    EventSubscriptionArn: "arn:aws:sns:...",
    EventSource: "aws:sns",
    Sns: {
      SignatureVersion: "1",
      Timestamp: new Date().toString(),
      Signature: faker.random.uuid(),
      SigningCertUrl: faker.internet.url(),
      MessageId: faker.random.uuid(),
      Message: JSON.stringify(message),
      MessageAttributes: {
        Test: {
          Type: "String",
          Value: faker.random.word()
        },
        TestNumber: {
          Type: "Number",
          Value: faker.random.number()
        }
      },
      Type: "Notification",
      UnsubscribeUrl: faker.internet.url(),
      TopicArn: "arn:aws:sns:...",
      Subject: "TestInvoke"
    }
  };

  const record = new Record(payload);

  describe('#record', () => {
    it('should match', () => {
      expect(record.record).toEqual(payload);
    })
  });

  describe('#message', () => {
    it('should match', () => {
      expect(record.message).toEqual(payload.Sns.Message);
    })
  });

  describe('#attributes', () => {
    it('should match', () => {
      expect(record.attributes).toEqual(payload.Sns.MessageAttributes);
    })
  });

  describe('#body', () => {
    it('should be the correct value', () => {
      expect(record.body).toBeInstanceOf(Object);
    });
  });
})
