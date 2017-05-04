'use strict';

import faker from 'faker';

import Record from '../../../src/events/S3/record';

describe('S3.Record', () => {
  const payload = {
    eventVersion: "2.0",
    eventTime: new Date().toString(),
    requestParameters: {
      sourceIPAddress: faker.internet.ip(),
    },
    s3: {
      configurationId: "testConfigRule",
      object: {
        eTag: "0123456789abcdef0123456789abcdef",
        sequencer: "0A1B2C3D4E5F678901",
        key: faker.system.commonFileName() + faker.system.commonFileExt(),
        size: faker.random.number()
      },
      bucket: {
        arn: "arn:aws:s3:::....",
        name: faker.system.commonFileName(),
        ownerIdentity: {
          principalId: "EXAMPLE"
        }
      },
      s3SchemaVersion: "1.0"
    },
    responseElements: {
      "x-amz-id2": `${faker.random.uuid()}/${faker.random.uuid()}`,
      "x-amz-requestid": faker.random.uuid(),
    },
    awsRegion: "us-east-1",
    eventName: "ObjectCreated:Put",
    userIdentity: {
      principalId: faker.random.word(),
    },
    eventSource: "aws:s3"
  };

  const record = new Record(payload);

  describe('#record', () => {
    it('should match', () => {
      expect(record.record).toEqual(payload);
    })
  });

  describe('when event is ObjectCreated:*', () => {
    describe('#type', () => {
      it('should match', () => {
        expect(record.type).toEqual('CREATED');
      })
    });
  });

  describe('when event is Objectremoved:*', () => {

    const altPayload = {
      ...payload,
      eventName: "ObjectRemoved:Delete",
    }

    describe('#type', () => {
      it('should match', () => {
        const removed = new Record(altPayload);
        expect(removed.type).toEqual('DELETED');
      })
    });
  });

  describe('when event is ReducedRedundancyLostObject', () => {

    const altPayload = {
      ...payload,
      eventName: "ReducedRedundancyLostObject",
    }

    describe('#type', () => {
      it('should match', () => {
        const removed = new Record(altPayload);
        expect(removed.type).toEqual('REDUCED_REDUNDANCY');
      })
    });
  });

  describe('when event is ObjectCreated:Put', () => {
    describe('#method', () => {
      it('should match', () => {
        expect(record.method).toEqual('PUT');
      })
    });
  });

  describe('when event is ObjectCreated:Post', () => {

    const altPayload = {
      ...payload,
      eventName: "ObjectCreated:Post",
    }

    describe('#method', () => {
      it('should match', () => {
        const removed = new Record(altPayload);
        expect(removed.method).toEqual('POST');
      })
    });
  });

  describe('when event is ObjectCreated:Copy', () => {

    const altPayload = {
      ...payload,
      eventName: "ObjectCreated:Copy",
    }

    describe('#method', () => {
      it('should match', () => {
        const removed = new Record(altPayload);
        expect(removed.method).toEqual('COPY');
      })
    });
  });

  describe('when event is ObjectCreated:CompleteMultipartUpload', () => {

    const altPayload = {
      ...payload,
      eventName: "ObjectCreated:CompleteMultipartUpload",
    }

    describe('#method', () => {
      it('should match', () => {
        const removed = new Record(altPayload);
        expect(removed.method).toEqual('COMPLETEMULTIPARTUPLOAD');
      })
    });
  });

  describe('#object', () => {
    it('should be the correct value', () => {
      expect(record.object).toEqual(payload.s3.object);
    });
  });

  describe('#bucket', () => {
    it('should be the correct value', () => {
      expect(record.bucket).toEqual(payload.s3.bucket);
    });
  });

  describe('#location', () => {
    it('should be the correct value', () => {
      expect(record.location).toEqual({
        Key: payload.s3.object.key,
        Bucket: payload.s3.bucket.name,
      });
    });
  });
})
