import { unmarshalItem } from 'dynamodb-marshaler';

import { CREATE, UPDATE, DELETE } from './constants';

export default class {
  constructor(record) {
    this.record = record;
  }

  get type() {
    switch (this.record.eventName) {
      case 'INSERT':
        return CREATE;
      case 'MODIFY':
        return UPDATE;
      case 'REMOVE':
        return DELETE;
      default:
        return this.record.eventName.toLowerCase();
    }
  }

  get keys() {
    return unmarshalItem(this.data.Keys);
  }

  get newImage() {
    return unmarshalItem(this.data.NewImage);
  }

  get oldImage() {
    return unmarshalItem(this.data.OldImage);
  }

  get data() {
    return this.record.dynamodb;
  }
}
