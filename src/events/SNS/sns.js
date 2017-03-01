import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import Record from './record';

export default class extends LambdaEvent {
  /**
   * The map of records received by the event.
   *
   * @return {Array[Record]} array of Record objects
   */
  get records() {
    return this.event.Records.map(r => new Record(r));
  }

  each() {
    throw new Error('missing #each implementation');
  }

  perform() {
    const promises = this.records.map(this.each, this);
    Promise.all(promises)
      .then(() => { this.response.respond(OK); })
      .catch(() => { this.response.respond(ERROR); });
  }
}
