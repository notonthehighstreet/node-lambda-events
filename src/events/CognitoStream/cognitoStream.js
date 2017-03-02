import request from 'request';

import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import { LOCAL, REMOTE } from './constants';
import Record from './record';

export default class extends LambdaEvent {
  each() {
    throw new Error('missing #each implementation');
  }

  async perform() {
    const records = await this.load();
    const promises = records.map(this.each, this);
    Promise.all(promises)
      .then(() => { this.respond(OK); })
      .catch((err) => { this.respond(ERROR, err.toString()); });
  }

  async load() {
    if (this.type === LOCAL) {
      return this.event.kinesisSyncRecords.map(r => new Record(r));
    } else if (this.type === REMOTE) {
      this.fetch();
      const body = await this.remote();
      const records = JSON.parse(body);
      return records.map(r => new Record(r));
    }
    return [];
  }

  remote() {
    const { url } = this;
    return new Promise((resolve, reject) => {
      request({ url }, (err, resp, body) => {
        if(err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

  get url() {
    return this.event.kinesisSyncRecordsURL;
  }

  get type() {
    return this.event.payloadType;
  }
}
