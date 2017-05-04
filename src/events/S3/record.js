import { CREATED, DELETED, REDUCED_REDUNDANCY } from './constants';

import { PUT, POST, COPY, COMPLETE_MULTIPART, DELETE_MARKER, DELETE } from './constants';

class Record {
  constructor(record) {
    this.record = record;
  }

  get type() {
    const event = this.record.eventName;
    if (event.match(/^(s3:)?ObjectCreated/g)) {
      return CREATED;
    } else if (event.match(/^(s3:)?ObjectRemoved/g)) {
      return DELETED;
    } else if (event.match(/^(s3:)?ReducedRedundancyLostObject/g)) {
      return REDUCED_REDUNDANCY;
    } else {
      return null;
    }
  }

  get method() {
    const event = this.record.eventName;
    const method = event.match(/^[s3:]?.+\:(.+)$/)[1];
    if (method) {
      return method.toUpperCase();
    }
    return null;
  }

  get object() {
    return this.record.s3.object;
  }

  get bucket() {
    return this.record.s3.bucket;
  }

  get location() {
    return {
      Key: this.object.key,
      Bucket: this.bucket.name,
    }
  }
}

export default Record;
