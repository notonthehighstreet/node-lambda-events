import LambdaEvent from '../lambdaEvent';
import { OK, ERROR } from '../../global';
import Response from './response';

import { FULFILLMENT, DIALOG } from './constants';

export default class extends LambdaEvent {
  get intentName() {
    return this.intent.name;
  }

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
    return this.event.sessionAttributes || {};
  }

  get mode() {
    // Text or Voice
    return this.event.outputDialogMode;
  }

  get type() {
    // dialog or fulfillment
    return this.event.invocationSource;
  }

  perform() {
    throw new Error('missing #perform implementation');
  }

  respond(...args) {
    return new Response(this.event, this.cb).respond(...args);
  }
}
