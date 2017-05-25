### Simple Lex Processing

The below example could be used to process slots and then reply with a `Close` message.

```javascript
import { Lex, OK, ERROR } from 'node-lambda-events';

class SimpleCancelEventHandler extends Lex {
  async perform() {
    await this.publish(this.intent.slots)
    this.respond(OK, {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message: {
        contentType: 'PlainText',
        content: "I've finished now!",
      },
    });
  }

  publish(obj) {
    // do some other processing...
  }
}

export default Lex.wrap(SimpleCancelEventHandler);
```
