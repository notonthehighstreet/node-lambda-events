class Record {
  constructor(record) {
    this.record = record;
  }

  get type() {
    return this.record.op;
  }

  get key() {
    return this.record.key;
  }

  get value() {
    return this.record.value;
  }
}

export default Record;
