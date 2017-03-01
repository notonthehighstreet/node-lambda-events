class Record {
  constructor(record) {
    this.record = record;
  }

  get attributes() {
    return this.record.Sns.MessageAttributes;
  }

  get payload() {
    return JSON.parse(this.record.Sns.Message);
  }
}

export default Record;
