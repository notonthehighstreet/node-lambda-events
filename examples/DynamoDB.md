### DynamoDB Record Publisher

This example demonstrates publishing each record received to a pre-defined SNS topic.

```javascript
import { DynamoDB, OK, ERROR } from 'node-lambda-events';

const TOPIC = process.env.SNS_TOPIC;
const REGION = process.env.AWS_REGION;

const PUBLISH = 'publish';

class SNSPublisher extends DynamoDB {
  each(record) {
    return this.sns(PUBLISH, {
      TopicArn: TOPIC,
      Message: JSON.stringify(record.newDocument.data);
    });
  }

  sns(op, params) {
    return Promise.fromCallback(cb => this.client[op](params));
  }

  get client() {
    return new AWS.SNS({ region: REGION });
  }
}

export default DynamoDB.wrap(SNSPublisher);
```
