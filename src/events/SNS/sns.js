import Promise from 'bluebird';

import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import Record from './record';
import Response from './response';

export default class extends LambdaEvent {
  constructor(event, context, cb) {
    super();
    /**
     * The raw event received by Lambda
     * @member {Object} SNS#event
     */
    this.event = event;
    this.records = event.Records.map(r => new Record(r));
    /**
     * The raw context object received by Lambda
     * @member {Object} SNS#context
     */
    this.context = context;
    /**
     * The response object allowing any extending class
     * to respond to SNS.
     * @member {Response} SNS#response
     */
    this.response = new Response(event, cb);
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
