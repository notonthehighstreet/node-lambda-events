import { unmarshalItem } from 'dynamodb-marshaler';

import { CREATE, UPDATE, DELETE } from './constants';

export default class {
  constructor(record) {
    this.record = record;
  }

  get type() {
    switch (this.record.StreamViewType) {
      case 'INSERT':
        return CREATE;
      case 'MODIFY':
        return UPDATE;
      case 'REMOVE':
        return DELETE;
      default:
        return this.record.StreamViewType.toLowerCase();
    }
  }

  get keys() {
    return this.data.Keys;
  }

  get newDocument() {
    return unmarshalItem(this.data.NewDocument);
  }

  get oldDocument() {
    return unmarshalItem(this.data.OldDocument);
  }

  get data() {
    return this.record.dynamodb;
  }
}
