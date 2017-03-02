import request from 'request';

import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import Record from './record';

export default class extends LambdaEvent {
  get records() {
    const entries = Object.entries(this.event.datasetRecords);
    return entries.reduce((memo, [key, obj]) => {
      memo[key] = new Record(key, obj);
      return memo;
    }, {});
  }

  delete(record) {
    delete this.event.datasetRecords[record.key]
  }

  get dataset() {
    return this.event.datasetName;
  }

  get identity() {
    return this.event.identityId;
  }
}
