import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import Record from './record';
import Response from './response';

export default class extends LambdaEvent {
  get intent() {
    return this.event.currentIntent;
  }

  get bot() {
    return this.event.bot;
  }

  get userId() {
    return this.event.userId;
  }

  get session() {
    return this.event.sessionAttributes;
  }

  get mode() {
    // Text or Voice
    return this.event.outputDialogMode;
  }

  perform() {
    throw new Error('missing #perform implementation');
  }

  respond(...args) {
    return new Response(this.event, this.cb).respond(...args);
  }
}
