'use strict';

import Cloudformation, { Response } from '../../../src/events/Cloudformation';

const event = {
  RequestType: "Update",
  PhysicalResourceId: "353-f-a-25-t-a-ba-2-aaaa",
  ResourceProperties: { foo: 'bar' },
};

const context = {}

const cb = jest.fn();

describe('Cloudformation', () => {

  const cfn = new Cloudformation(event, context, cb);

  test('#event', () => {
    expect(cfn.event).toEqual(event);
  });

  test('#properties', () => {
    expect(cfn.properties).toEqual(event.ResourceProperties);
  });

  test('#id', () => {
    expect(cfn.id).toEqual(event.PhysicalResourceId);
  });

  test('#type', () => {
    expect(cfn.type).toEqual(event.RequestType.toLowerCase());
  });

  test('#event', () => {
    expect(cfn.event).toEqual(event);
  });

  test('#context', () => {
    expect(cfn.context).toEqual(context);
  });

  test('cb', () => {
    expect(cfn.response.cb).toEqual(cb);
  });

  describe('#perform', () => {
    it('should call the correct handler', () => {
      cfn[event.RequestType.toLowerCase()] = jest.fn();
      cfn.perform();
      expect(cfn[event.RequestType.toLowerCase()]).toHaveBeenCalledTimes(1);
    })
  });
});
