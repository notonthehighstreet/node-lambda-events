import { CREATE, UPDATE, DELETE } from './constants';
import Document from './document';

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
        return undefined;
    }
  }

  get keys() {
    return this.data.Keys;
  }

  get newDocument() {
    return new Document(this.data.NewDocument);
  }

  get oldDocument() {
    return new Document(this.data.OldDocument);
  }

  get data() {
    return this.record.dynamodb;
  }
}
