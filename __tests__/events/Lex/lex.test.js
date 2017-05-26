'use strict';

import faker from 'faker';

import Lex from '../../../src/events/Lex';
import Response from '../../../src/events/Lex/response';
import { OK, ERROR } from '../../../src/global';

const records = [{}];

const event = {
  currentIntent: {
    name: "intent-name",
    slots: {
      [faker.random.word()]: faker.random.word(),
      [faker.random.word()]: faker.random.word(),
      [faker.random.word()]: faker.random.word(),
    },
    confirmationStatus: "None, Confirmed, or Denied (intent confirmation, if configured)",
  },
  bot: {
    name: faker.random.word(),
    alias: faker.random.word(),
    version: '$LATEST',
  },
  userId: faker.random.uuid(),
  inputTranscript: faker.random.words(),
  invocationSource: faker.random.arrayElement(['FulfillmentCodeHook', 'DialogCodeHook']),
  outputDialogMode: faker.random.arrayElement(['Text', 'Voice']),
  messageVersion: "1.0",
  sessionAttributes: {
    [faker.random.word()]: faker.random.number(),
    [faker.random.word()]: faker.random.number(),
    [faker.random.word()]: faker.random.number(),
    [faker.random.word()]: faker.random.number(),
  }
};

const context = {}

const cb = jest.fn();

describe('Lex', () => {

  const lex = new Lex(event, context, cb);

  test('#intentName', () => {
    expect(lex.intentName).toEqual(event.currentIntent.name);
  });

  test('#intent', () => {
    expect(lex.intent).toEqual(event.currentIntent);
  });

  test('#bot', () => {
    expect(lex.bot).toEqual(event.bot);
  });

  test('#userId', () => {
    expect(lex.userId).toEqual(event.userId);
  });

  test('#session', () => {
    expect(lex.session).toEqual(event.sessionAttributes);
  });

  test('#mode', () => {
    expect(lex.mode).toEqual(event.outputDialogMode);
  });

  test('#type', () => {
    expect(lex.type).toEqual(event.invocationSource);
  });

  describe('#response', () => {
    describe('when execution was successful', () => {

      const dialogAction = {
        type: 'Close',
        fulfillmentState: 'Fulfilled',
        message: {
          content: 'All done!',
        },
      };

      it('when the response is valid', async () => {
        const cb = jest.fn();
        const lex = new Lex(event, context, cb);
        await lex.respond(OK, dialogAction, {})
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(null, expect.objectContaining({
          sessionAttributes: expect.any(Object),
          dialogAction: expect.any(Object),
        }));
      })

      test('when the response is invalid', async () => {
        const cb = jest.fn();
        const lex = new Lex(event, context, cb);
        await lex.respond(OK, {}, {})
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
      })
    });

    describe('when execution failed', () => {
      it('should call the callback', async () => {
        const cb = jest.fn();
        const lex = new Lex(event, context, cb);
        await lex.respond(ERROR, {}, {});
        expect(cb).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledWith(null, expect.objectContaining({
          sessionAttributes: expect.any(Object),
          dialogAction: expect.objectContaining({
            type: 'Close',
            fulfillmentState: 'Failed',
            message: expect.objectContaining({
              content: 'Sorry! There was an internal error.'
            }),
          }),
        }));
      })
    })
  });

  // describe('#perform', () => {
  //   const each = jest.fn();
  //
  //   const sns = new SNS(event, context, cb);
  //
  //   sns.each = each;
  //
  //   it('should call #each', () => {
  //     sns.perform();
  //     expect(each).toHaveBeenCalledTimes(records.length);
  //     expect(each).toHaveBeenLastCalledWith(expect.any(Record), expect.anything(), expect.anything());
  //   })
  // });
});
