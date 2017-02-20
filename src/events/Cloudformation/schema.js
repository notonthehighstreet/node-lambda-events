import Joi from 'joi';

import { FAILED } from './constants';

export const Schema = Joi.object().keys({
  Status: Joi.string().required(),
  Reason: Joi.when('Status', {
    is: FAILED,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  PhysicalResourceId: Joi.when('Status', {
    is: FAILED,
    then: Joi.string().optional(),
    otherwise: Joi.string().required(),
  }),
  StackId: Joi.string().required(),
  RequestId: Joi.string().required(),
  LogicalResourceId: Joi.string().required(),
  Data: Joi.object().required(),
});
