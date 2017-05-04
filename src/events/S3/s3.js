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

  async perform() {
    try {
      const promises = this.records.map(this.each, this);
      await Promise.all(promises);
      this.respond(OK);
    } catch(err) {
      this.respond(ERROR);
    }
  }
}
