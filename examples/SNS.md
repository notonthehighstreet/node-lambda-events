### Simple SNS Webhook

The below example shows how an SNS event could be received which is then forwarded onto a remote URL.

```javascript
import request from 'request-promise';
import { SNS, OK, ERROR } from 'node-lambda-events';

class WebhookForwarder extends SNS {
  each(record) {
    return this.push(record.payload)
  }

  push({ url, body }) {
    return request({ url, body })
  }
}

export default SNS.wrap(WebhookForwarder);
```
