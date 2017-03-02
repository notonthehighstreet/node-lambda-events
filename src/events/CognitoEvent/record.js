class Record {
  constructor(key, body) {
    this.body = body;
    this.key = key;
  }

  get type() {
    return this.body.op;
  }

  get newValue() {
    return this.body.newValue;
  }

  get oldValue() {
    return this.body.oldValue;
  }
}

export default Record;
