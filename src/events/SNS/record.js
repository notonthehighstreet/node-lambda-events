class Record {
  constructor(record) {
    this.record = record;
  }

  get attributes() {
    return this.record.Sns.MessageAttributes;
  }

  get message() {
    return this.record.Sns.Message;
  }

  get body() {
    return this.parse(this.message);
  }

  parse(message) {
    return JSON.parse(message);
  }
}

export default Record;
