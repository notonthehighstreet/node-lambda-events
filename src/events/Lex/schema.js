import Joi from 'joi';

import { FAILED } from './constants';

export const Schema = Joi.object().keys({
  sessionAttributes: Joi.object(),

  dialogAction: Joi.object().keys({

    type: Joi.string().valid('Close', 'ConfirmIntent', 'Delegate', 'ElicitIntent', 'ElicitSlot'),

    fulfillmentState: Joi.when('type', {
      is: 'Close',
      then: Joi.string().valid('Fulfilled', 'Failed').required(),
      otherwise: Joi.forbidden(),
    }),

    intentName: Joi.when('type', {
      is: 'ConfirmIntent',
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),

    slots: Joi.when('type', {
      is: /^(ConfirmIntent|Delegate)$/,
      then: Joi.object().required(),
      otherwise: Joi.forbidden(),
    }),

    slotToElicit: Joi.when('type', {
      is: 'ElicitSlot',
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),

    message: Joi.object().keys({
      contentType: Joi.string().default('PlainText').valid('PlainText', 'SSML'),
      content: Joi.string().required(),
    }),

    responseCard: Joi.object().keys({
      version: Joi.number().min(0),
      contentType: Joi.string().valid("application/vnd.amazonaws.card.generic"),
      genericAttachments: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          subTitle: Joi.string(),
          imageUrl: Joi.string().uri(),
          attachmentLinkUrl: Joi.string().uri(),
          buttons: Joi.array().items(
            Joi.object().keys({
              text: Joi.string().required(),
              value: Joi.string().required(),
            })
          ),
        })
      )
    }),

  }).requiredKeys('type').required(),
});
